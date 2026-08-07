export type UserType = 'ADMIN' | 'COACH' | 'STUDENT' | 'PENDING' | 'UNKNOWN';

export interface User {
  user_type: UserType;
  user_id?: string;
  name?: string;
  mobile_number: string;
  dashboard?: string;
}

export interface TrialSlot {
  slot_id: string;
  day: string;
  start_time: string;
  end_time: string;
  capacity: number;
  booked: number;
  available_slots: number;
}

export interface TrialBooking {
  id: string;
  booking_reference: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  number_of_participants: number;
  amount_per_person: number;
  total_amount: number;
  full_name: string;
  mobile_number: string;
  place: string;
  booking_status: string;
}

export interface Registration {
  id: string;
  first_name: string;
  last_name?: string;
  mobile_number: string;
  email?: string;
  gender?: string;
  city?: string;
  riding_experience?: string;
  registration_status: string;
  created_at: string;
}

export interface Student {
  id: string;
  student_number: string;
  joining_date: string;
  membership_status: string;
  monthly_fee?: number;
  batch_id?: string;
  first_name?: string;
  last_name?: string;
  mobile_number?: string;
  email?: string;
  city?: string;
}

export interface Coach {
  id: string;
  first_name: string;
  last_name?: string;
  mobile_number: string;
  email?: string;
  experience_years?: number;
  specialization?: string;
  assigned_place?: string;
  is_active: boolean;
}

export interface Batch {
  id: string;
  batch_name: string;
  coach_id: string;
  training_day: string;
  start_time: string;
  end_time: string;
  maximum_strength: number;
  is_active: boolean;
}

export interface Horse {
  id: string;
  stable_name: string;
  name?: string;
  registered_name?: string;
  breed?: string;
  gender?: string;
  color?: string;
  training_level?: string;
  suitable_for_beginners: boolean;
  available_for_lessons: boolean;
  available_for_lease: boolean;
  lease_events?: string;
  image_path?: string;
  is_active: boolean;
}

export interface Facility {
  id: string;
  facility_name: string;
  short_description?: string;
  detailed_description?: string;
  image_path?: string;
  display_order: number;
  show_on_homepage: boolean;
  is_active: boolean;
}

export interface TeamMember {
  id: string;
  first_name: string;
  last_name?: string;
  designation: string;
  short_bio?: string;
  profile_image_path?: string;
  display_order: number;
  is_active: boolean;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  customer_type: string;
  rating: number;
  testimonial: string;
  profile_image_path?: string;
  show_on_homepage?: boolean;
  is_approved: boolean;
  is_active: boolean;
}

export interface ClubLocation {
  id: string;
  branch_name: string;
  address_line_1: string;
  city: string;
  state: string;
  contact_number?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
}

export interface AttendanceRecord {
  date: string;
  status: string;
  remarks?: string;
}

export interface ProgressRecord {
  id: string;
  date: string;
  riding_level: string;
  coach_remarks?: string;
  performance_rating?: number;
  skills_learned?: string;
  strengths?: string;
  areas_for_improvement?: string;
  next_goals?: string;
  assessment_date?: string;
}

export interface FeePayment {
  id: string;
  payment_date: string;
  amount_paid: number;
  payment_mode: string;
  payment_for_month: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error_code?: string;
}

export interface AdminDashboard {
  total_students: number;
  active_students: number;
  pending_registrations: number;
  total_bookings: number;
  today_bookings: number;
  total_horses: number;
  active_coaches: number;
}
