import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://drink-tracker-batiboys.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtodmZlbXJmYnRkcWJkandueHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MTI1NjgsImV4cCI6MjA2MTA4ODU2OH0.sl1SZYcViCpz2fz23TNDg6eGSYNQqVPz4EcpWIiqEa8

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
