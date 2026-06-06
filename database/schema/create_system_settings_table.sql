-- Create system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
  key VARCHAR(100) PRIMARY KEY,
  value VARCHAR(500) NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default configurations
INSERT INTO public.system_settings (key, value, description) 
VALUES
('maintenance_mode', 'false', 'Kích hoạt chế độ bảo trì hệ thống (true/false)'),
('maintenance_message', 'Hệ thống TravelConnectVN đang bảo trì để nâng cấp dịch vụ. Vui lòng quay lại sau.', 'Nội dung thông báo hiển thị khi bảo trì'),
('commission_rate', '0.10', 'Tỷ lệ phí dịch vụ hoa hồng thu nhập của hướng dẫn viên')
ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Drop policies if exist to prevent duplicate errors
DROP POLICY IF EXISTS "Allow public read access to system_settings" ON public.system_settings;
DROP POLICY IF EXISTS "Allow SYSTEM_ADMIN write access to system_settings" ON public.system_settings;

-- Create policies
CREATE POLICY "Allow public read access to system_settings"
  ON public.system_settings FOR SELECT USING (true);

CREATE POLICY "Allow SYSTEM_ADMIN write access to system_settings"
  ON public.system_settings FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role_code = 'SYSTEM_ADMIN'
    )
  );
