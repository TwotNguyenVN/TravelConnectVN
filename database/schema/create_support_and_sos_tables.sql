-- Bảng SOS Alerts
CREATE TABLE public.sos_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tour_id UUID REFERENCES public.tours(id) ON DELETE SET NULL,
  latitude DECIMAL(9, 6) NOT NULL,
  longitude DECIMAL(9, 6) NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'resolved'
  note TEXT,
  resolved_by_user_id UUID REFERENCES public.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng Support Tickets
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'payment', 'dispute', 'account', 'other'
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'resolved', 'closed'
  assigned_to_user_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng Tour Disputes
CREATE TABLE public.tour_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_request_id UUID NOT NULL UNIQUE REFERENCES public.tour_requests(id) ON DELETE CASCADE,
  raised_by_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open', -- 'open', 'resolved'
  resolved_by_user_id UUID REFERENCES public.users(id),
  resolution_note TEXT,
  refund_amount DECIMAL(12, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Kích hoạt RLS
ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_disputes ENABLE ROW LEVEL SECURITY;

-- Thiết lập Policies
CREATE POLICY "Allow users to insert sos" ON public.sos_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow support staff to manage sos" ON public.sos_alerts FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role_code IN ('SYSTEM_ADMIN', 'SUPPORT_STAFF'))
);

CREATE POLICY "Allow users to manage own tickets" ON public.support_tickets FOR ALL TO authenticated USING (auth.uid() = reporter_user_id);
CREATE POLICY "Allow support staff to manage tickets" ON public.support_tickets FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role_code IN ('SYSTEM_ADMIN', 'SUPPORT_STAFF'))
);

CREATE POLICY "Allow users to view own disputes" ON public.tour_disputes FOR SELECT TO authenticated USING (auth.uid() = raised_by_user_id);
CREATE POLICY "Allow support staff to manage disputes" ON public.tour_disputes FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role_code IN ('SYSTEM_ADMIN', 'SUPPORT_STAFF'))
);
