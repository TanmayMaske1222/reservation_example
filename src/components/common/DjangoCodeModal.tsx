import React, { useState } from 'react';
import { X, Code2, Database, FileText, Copy, Check, Terminal, Layers } from 'lucide-react';

interface DjangoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DJANGO_FILES = {
  'models.py': `# ts_train_sys/reservations/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid

class User(AbstractUser):
    ROLE_CHOICES = (
        ('USER', 'Traveler'),
        ('ADMIN', 'System Administrator'),
    )
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('BLOCKED', 'Blocked'),
    )
    phone = models.CharField(max_length=15, unique=True, null=True, blank=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='USER')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ACTIVE')
    dob = models.DateField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_admin_role(self):
        return self.role == 'ADMIN' or self.is_superuser


class Train(models.Model):
    train_number = models.CharField(max_length=10, unique=True)
    train_name = models.CharField(max_length=150)
    source = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    duration = models.CharField(max_length=30)
    train_type = models.CharField(max_length=50, default='Superfast')
    fare = models.DecimalField(max_digits=10, decimal_places=2, default=1500.00)
    capacity = models.IntegerField(default=500)
    runs_on = models.CharField(max_length=100, default='Daily')
    status = models.CharField(max_length=20, default='ON_TIME')

    def __str__(self):
        return f"{self.train_number} - {self.train_name} ({self.source} -> {self.destination})"


class Flight(models.Model):
    flight_number = models.CharField(max_length=20, unique=True)
    airline = models.CharField(max_length=100)
    source_airport = models.CharField(max_length=100)
    destination_airport = models.CharField(max_length=100)
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    duration = models.CharField(max_length=30)
    stops = models.CharField(max_length=30, default='Non-stop')
    capacity = models.IntegerField(default=180)
    fare = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.flight_number} - {self.airline}"


class Bus(models.Model):
    bus_number = models.CharField(max_length=20, unique=True)
    operator = models.CharField(max_length=100)
    bus_type = models.CharField(max_length=100)
    source = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    duration = models.CharField(max_length=30)
    seat_capacity = models.IntegerField(default=40)
    fare = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.bus_number} - {self.operator}"


class Booking(models.Model):
    TRANSPORT_CHOICES = (
        ('TRAIN', 'Railway'),
        ('FLIGHT', 'Flight'),
        ('BUS', 'Intercity Bus'),
    )
    STATUS_CHOICES = (
        ('CONFIRMED', 'Confirmed'),
        ('PENDING', 'Pending'),
        ('CANCELLED', 'Cancelled'),
        ('COMPLETED', 'Completed'),
    )
    pnr = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    transport_type = models.CharField(max_length=10, choices=TRANSPORT_CHOICES)
    transport_id = models.CharField(max_length=50)
    transport_number = models.CharField(max_length=50)
    transport_name = models.CharField(max_length=150)
    source = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    journey_date = models.DateField()
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    travel_class = models.CharField(max_length=50)
    seat_numbers = models.CharField(max_length=100)  # Comma separated e.g. "C4-24, C4-25"
    passengers_json = models.JSONField(default=list)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    booking_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='CONFIRMED')
    payment_status = models.CharField(max_length=20, default='PAID')
    payment_method = models.CharField(max_length=30, default='UPI')
    transaction_id = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Payment(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='payment_record')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    payment_status = models.CharField(max_length=30, default='PAID')
    transaction_id = models.CharField(max_length=100, unique=True)
    payment_date = models.DateTimeField(default=timezone.now)
`,

  'views.py': `# ts_train_sys/reservations/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.http import JsonResponse, HttpResponse
from django.db.models import Count, Sum
from .models import User, Train, Flight, Bus, Booking, Payment
from .forms import UserRegistrationForm, TrainForm, BookingForm
import random

# Access Control Decorator
def is_admin(user):
    return user.is_authenticated and (user.role == 'ADMIN' or user.is_superuser)

# ----------------- PUBLIC VIEWS -----------------
def home(request):
    return render(request, 'public/home.html', {
        'total_trains': Train.objects.count(),
        'total_flights': Flight.objects.count(),
        'total_buses': Bus.objects.count(),
    })

def about(request):
    return render(request, 'public/about.html')

def contact(request):
    return render(request, 'public/contact.html')

# ----------------- USER PORTAL VIEWS -----------------
@login_required(login_url='/login/')
def user_dashboard(request):
    user_bookings = Booking.objects.filter(user=request.user).order_by('-created_at')
    upcoming_journey = user_bookings.filter(booking_status='CONFIRMED').first()
    
    context = {
        'total_bookings': user_bookings.count(),
        'train_bookings': user_bookings.filter(transport_type='TRAIN').count(),
        'flight_bookings': user_bookings.filter(transport_type='FLIGHT').count(),
        'bus_bookings': user_bookings.filter(transport_type='BUS').count(),
        'cancelled_bookings': user_bookings.filter(booking_status='CANCELLED').count(),
        'upcoming_journey': upcoming_journey,
        'recent_bookings': user_bookings[:5],
    }
    return render(request, 'user/dashboard.html', context)

@login_required(login_url='/login/')
def train_search(request):
    source = request.GET.get('source', '')
    destination = request.GET.get('destination', '')
    trains = Train.objects.all()
    if source:
        trains = trains.filter(source__icontains=source)
    if destination:
        trains = trains.filter(destination__icontains=destination)
    return render(request, 'user/trains.html', {'trains': trains})

@login_required(login_url='/login/')
def my_bookings(request):
    filter_status = request.GET.get('status', 'all')
    bookings = Booking.objects.filter(user=request.user).order_by('-created_at')
    if filter_status == 'upcoming':
        bookings = bookings.filter(booking_status='CONFIRMED')
    elif filter_status == 'cancelled':
        bookings = bookings.filter(booking_status='CANCELLED')
    return render(request, 'user/my_bookings.html', {'bookings': bookings})

@login_required(login_url='/login/')
def cancel_booking(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id, user=request.user)
    if booking.booking_status == 'CONFIRMED':
        booking.booking_status = 'CANCELLED'
        booking.payment_status = 'REFUNDED'
        booking.save()
        messages.success(request, f'Booking {booking.pnr} has been cancelled successfully. Refund initiated.')
    return redirect('my_bookings')

# ----------------- ADMIN PORTAL VIEWS -----------------
@user_passes_test(is_admin, login_url='/admin/login/')
def admin_dashboard(request):
    total_revenue = Booking.objects.filter(booking_status='CONFIRMED').aggregate(Sum('amount'))['amount__sum'] or 0
    context = {
        'total_users': User.objects.filter(role='USER').count(),
        'total_bookings': Booking.objects.count(),
        'train_count': Train.objects.count(),
        'flight_count': Flight.objects.count(),
        'bus_count': Bus.objects.count(),
        'total_revenue': total_revenue,
        'recent_reservations': Booking.objects.all().order_by('-created_at')[:8],
    }
    return render(request, 'admin/dashboard.html', context)

@user_passes_test(is_admin, login_url='/admin/login/')
def admin_train_management(request):
    trains = Train.objects.all()
    return render(request, 'admin/trains.html', {'trains': trains})
`,

  'urls.py': `# ts_train_sys/urls.py
from django.contrib import admin
from django.urls import path
from reservations import views

urlpatterns = [
    # Public Routes
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),

    # User Portal Routes (Protected)
    path('user/dashboard/', views.user_dashboard, name='user_dashboard'),
    path('user/trains/', views.train_search, name='user_trains'),
    path('user/flights/', views.flight_search, name='user_flights'),
    path('user/buses/', views.bus_search, name='user_buses'),
    path('user/bookings/', views.my_bookings, name='my_bookings'),
    path('user/ticket/<int:booking_id>/', views.view_ticket, name='view_ticket'),
    path('user/cancel/<int:booking_id>/', views.cancel_booking, name='cancel_booking'),
    path('user/profile/', views.user_profile, name='user_profile'),

    # Admin Portal Routes (Role-Restricted)
    path('admin/login/', views.admin_login, name='admin_login'),
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin/users/', views.admin_users, name='admin_users'),
    path('admin/trains/', views.admin_trains, name='admin_trains'),
    path('admin/flights/', views.admin_flights, name='admin_flights'),
    path('admin/buses/', views.admin_buses, name='admin_buses'),
    path('admin/bookings/', views.admin_bookings, name='admin_bookings'),
    path('admin/payments/', views.admin_payments, name='admin_payments'),
    path('admin/reports/', views.admin_reports, name='admin_reports'),
    path('admin/settings/', views.admin_settings, name='admin_settings'),
]
`,

  'schema.sql': `-- SQLite3 Relational Database Schema for TS train_sys
CREATE TABLE IF NOT EXISTS reservations_user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(150) NOT NULL UNIQUE,
    email VARCHAR(254) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    role VARCHAR(10) DEFAULT 'USER',
    status VARCHAR(10) DEFAULT 'ACTIVE',
    phone VARCHAR(15),
    dob DATE,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservations_train (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    train_number VARCHAR(10) NOT NULL UNIQUE,
    train_name VARCHAR(150) NOT NULL,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    duration VARCHAR(30) NOT NULL,
    train_type VARCHAR(50) DEFAULT 'Superfast',
    capacity INTEGER DEFAULT 500,
    fare DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS reservations_flight (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_number VARCHAR(20) NOT NULL UNIQUE,
    airline VARCHAR(100) NOT NULL,
    source_airport VARCHAR(100) NOT NULL,
    destination_airport VARCHAR(100) NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    duration VARCHAR(30) NOT NULL,
    stops VARCHAR(30) DEFAULT 'Non-stop',
    capacity INTEGER DEFAULT 180,
    fare DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS reservations_bus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bus_number VARCHAR(20) NOT NULL UNIQUE,
    operator VARCHAR(100) NOT NULL,
    bus_type VARCHAR(100) NOT NULL,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    duration VARCHAR(30) NOT NULL,
    seat_capacity INTEGER DEFAULT 40,
    fare DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS reservations_booking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pnr VARCHAR(20) NOT NULL UNIQUE,
    user_id INTEGER NOT NULL REFERENCES reservations_user(id),
    transport_type VARCHAR(10) NOT NULL,
    transport_id VARCHAR(50) NOT NULL,
    transport_number VARCHAR(50) NOT NULL,
    transport_name VARCHAR(150) NOT NULL,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    journey_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    travel_class VARCHAR(50) NOT NULL,
    seat_numbers VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    booking_status VARCHAR(20) DEFAULT 'CONFIRMED',
    payment_status VARCHAR(20) DEFAULT 'PAID',
    payment_method VARCHAR(30) DEFAULT 'UPI',
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`
};

export const DjangoCodeModal: React.FC<DjangoCodeModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<keyof typeof DJANGO_FILES>('models.py');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(DJANGO_FILES[selectedFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold font-mono">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Python Django Architecture & Database Schema</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Django 5.x + SQLite
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official backend codebase and relational ORM schema for final-year viva and project documentation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Tabs */}
        <div className="px-6 pt-3 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex space-x-1 overflow-x-auto">
            {Object.keys(DJANGO_FILES).map((fileName) => (
              <button
                key={fileName}
                onClick={() => setSelectedFile(fileName as keyof typeof DJANGO_FILES)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-mono transition border-b-2 ${
                  selectedFile === fileName
                    ? 'bg-slate-800 text-orange-300 border-[#fb792b] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40'
                }`}
              >
                {fileName.endsWith('.py') ? (
                  <FileText className="w-3.5 h-3.5 text-yellow-400" />
                ) : (
                  <Database className="w-3.5 h-3.5 text-blue-400" />
                )}
                <span>{fileName}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition mb-2"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="p-6 bg-slate-900/90 max-h-[60vh] overflow-y-auto font-mono text-xs leading-relaxed text-slate-300">
          <pre className="whitespace-pre-wrap select-text">
            <code>{DJANGO_FILES[selectedFile]}</code>
          </pre>
        </div>

        {/* Summary Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Ready for Django <code className="text-emerald-400">python manage.py runserver</code></span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Full SQLite / PostgreSQL Compatibility</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
