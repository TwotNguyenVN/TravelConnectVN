-- Create guide_incomes table
CREATE TABLE public.guide_incomes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guide_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    schedule_id UUID NOT NULL REFERENCES public.tour_schedules(id) ON DELETE CASCADE,
    total_participants INTEGER NOT NULL DEFAULT 0,
    gross_revenue DECIMAL(15, 2) NOT NULL DEFAULT 0,
    system_fee DECIMAL(15, 2) NOT NULL DEFAULT 0,
    net_revenue DECIMAL(15, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT guide_incomes_schedule_id_unique UNIQUE (schedule_id)
);

-- RLS policies
ALTER TABLE public.guide_incomes ENABLE ROW LEVEL SECURITY;

-- Select policies
CREATE POLICY "Guides can view their own incomes" 
ON public.guide_incomes FOR SELECT 
USING (auth.uid() = guide_id);

CREATE POLICY "Admins can view all guide incomes" 
ON public.guide_incomes FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role_code IN ('admin', 'staff')
    )
);

-- Insert policies (Only admins/system can insert)
CREATE POLICY "Admins can insert guide incomes"
ON public.guide_incomes FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() AND role_code IN ('admin', 'staff')
    )
);

-- Update trigger for updated_at
CREATE TRIGGER update_guide_incomes_modtime
    BEFORE UPDATE ON public.guide_incomes
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();
