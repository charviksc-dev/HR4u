-- Add attendance policies and rules
CREATE TABLE IF NOT EXISTS shift_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_duration INTEGER DEFAULT 60, -- in minutes
  days_of_week INTEGER[] DEFAULT '{1,2,3,4,5}', -- 1=Monday, 7=Sunday
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_shifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) NOT NULL,
  shift_template_id UUID REFERENCES shift_templates(id),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_duration INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'missed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(employee_id, date)
);

-- Insert default shift templates
INSERT INTO shift_templates (name, start_time, end_time, break_duration, days_of_week) VALUES
  ('Standard Day Shift', '09:00:00', '17:00:00', 60, '{1,2,3,4,5}'),
  ('Early Morning Shift', '06:00:00', '14:00:00', 60, '{1,2,3,4,5}'),
  ('Evening Shift', '14:00:00', '22:00:00', 60, '{1,2,3,4,5}'),
  ('Night Shift', '22:00:00', '06:00:00', 60, '{1,2,3,4,5}'),
  ('Weekend Shift', '10:00:00', '18:00:00', 60, '{6,7}')
ON CONFLICT DO NOTHING;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON attendance(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_employee_shifts_employee_date ON employee_shifts(employee_id, date);

-- Enable RLS for new tables
ALTER TABLE shift_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_shifts ENABLE ROW LEVEL SECURITY;

-- Create policies for shift management
CREATE POLICY "Employees can view own shifts" ON employee_shifts
  FOR SELECT USING (
    employee_id IN (
      SELECT id FROM employees WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Managers can view all shifts" ON employee_shifts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'hr', 'manager')
    )
  );

CREATE POLICY "Everyone can view shift templates" ON shift_templates
  FOR SELECT USING (true);
