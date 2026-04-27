import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { tourService } from "../../services/tourService";
import { getAllAccommodations } from "../../services/accommodationService";
import { Button } from "../../components/common/Button/Button";
import { Modal } from "../../components/common/Modal/Modal";
import { useToast } from "../../contexts/ToastContext";
import { supabase } from "../../utils/supabase";
import "./TourFormPage.css";

interface Category {
  id: string;
  name: string;
}

interface ItineraryItem {
  locationName: string;
  address: string;
  visitTime: string;
  notes: string;
  hasBreakfast?: boolean;
  hasLunch?: boolean;
  hasDinner?: boolean;
  accommodation?: string;
  note?: string;
  latitude?: number;
  longitude?: number;
}

interface DestinationItem {
  name: string;
  address: string;
  googleMapsLink: string;
  lat?: number | string;
  lng?: number | string;
}

interface TourImage {
  imageUrl: string;
  caption: string;
  isCover: boolean;
}

interface AccommodationItem {
  accommodationId: string;
  name: string;
  checkInDate: string;
  checkOutDate: string;
  notes: string;
}

// Helper to extract coordinates from Google Maps URL
const extractLatLng = (url: string): { lat: string, lng: string } | null => {
  if (!url) return null;
  try {
    const patterns = [
      /@(-?\d+\.\d+),(-?\d+\.\d+)/,
      /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/,
      /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
      /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/,
      /place\/[^/]+\/(-?\d+\.\d+),(-?\d+\.\d+)/,
      /(-?\d+\.\d+),(-?\d+\.\d+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return { lat: match[1], lng: match[2] };
    }
  } catch (e) { console.error(e); }
  return null;
};

// Helper to get coordinates from Nominatim (OpenStreetMap)
const fetchFromNominatim = async (query: string): Promise<{ lat: string, lng: string } | null> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
    const data = await response.json();
    if (data && data.length > 0) {
      return { lat: data[0].lat, lng: data[0].lon };
    }
  } catch (e) { console.error("Nominatim error:", e); }
  return null;
};

const TourFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // System States
  const [categories, setCategories] = useState<Category[]>([]);
  const [allAccommodations, setAllAccommodations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [canDrag, setCanDrag] = useState(false);
  const { toast } = useToast();



  const [provinces, setProvinces] = useState<string[]>([]);

  // Form Data
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    price: "" as any,
    maxParticipants: "" as any,
    description: "",
    participantRequirements: "",
    province: "",
    otherProvinces: [] as string[],
    district: "",
    meetPoint: "",
    meetAddress: "",
    meetTime: "",
    googleMapsLink: "",
    meetLatitude: undefined as number | undefined,
    meetLongitude: undefined as number | undefined,
    duration: "",
    numDays: "" as any,
    numNights: "" as any,
    startDate: "",
    endDate: "",
    businessStatus: "draft",
    visibilityStatus: "visible",
    itinerary: [
      { 
        locationName: "", 
        address: "", 
        visitTime: "", 
        notes: "",
        hasBreakfast: false,
        hasLunch: false,
        hasDinner: false,
        accommodation: "",
        note: ""
      },
    ] as ItineraryItem[],
    destinations: [
      { name: "", address: "", googleMapsLink: "" }
    ] as DestinationItem[],
    images: [] as TourImage[],
    accommodations: [] as AccommodationItem[],
    routeMapLink: "",
  });

  const [selectedAction, setSelectedAction] = useState<'draft' | 'published' | 'closed' | 'cancelled' | null>(null);

  const isPublished = formData.businessStatus === 'published' || formData.businessStatus === 'closed' || formData.businessStatus === 'cancelled';
  const wasPublished = useRef(false);

  useEffect(() => {
    if (formData.businessStatus === 'published' && !wasPublished.current) {
      wasPublished.current = true;
    }
  }, [formData.businessStatus]);

  const handleStatusUpdatePage = async (newStatus: string, successMsg: string) => {
    try {
      setSubmitting(true);
      const response = await tourService.updateTour(id!, { businessStatus: newStatus });
      if (response.success || response.id) {
        toast.success(successMsg);
        setFormData({ ...formData, businessStatus: newStatus });
        if (newStatus === 'cancelled') {
          navigate('/guide/tours');
        }
      }
    } catch (error: any) {
      console.error('Update status error:', error);
      toast.error('Không thể cập nhật trạng thái tour');
    } finally {
      setSubmitting(false);
    }
  };
  const [participantCount, setParticipantCount] = useState(0);

  const getStatusLabel = (business: string, visibility: string) => {
    if (business === "draft") return { label: "Bản nháp", color: "var(--tc-text-secondary)", icon: "📝" };
    if (business === "published") return { label: "Đang mở", color: "#22c55e", icon: "🚀" };
    if (business === "closed") {
      if (visibility === "hidden") return { label: "Tạm ngưng", color: "#f59e0b", icon: "⏸️" };
      return { label: "Đã đóng ĐK", color: "#6366f1", icon: "🔒" };
    }
    if (business === "cancelled") return { label: "Đã hủy", color: "#ef4444", icon: "🗑️" };
    if (business === "completed") return { label: "Hoàn tất", color: "#10b981", icon: "🏆" };
    return { label: "Không rõ", color: "var(--tc-text-secondary)", icon: "❓" };
  };

  const statusInfo = getStatusLabel(formData.businessStatus, formData.visibilityStatus);

  const [provinceSearch, setProvinceSearch] = useState("");
  const [showProvinceSuggestions, setShowProvinceSuggestions] = useState(false);
  const filteredProvinces = provinces.filter((p) =>
    p.toLowerCase().includes(provinceSearch.toLowerCase()),
  );

  const selectProvince = (p: string) => {
    setFormData((prev) => ({ ...prev, province: p }));
    setProvinceSearch(p);
    setShowProvinceSuggestions(false);
  };

  const [otherProvinceSearch, setOtherProvinceSearch] = useState("");
  const [showOtherSuggestions, setShowOtherSuggestions] = useState(false);
  const filteredOtherProvinces = provinces.filter((p) =>
    p.toLowerCase().includes(otherProvinceSearch.toLowerCase()) && 
    p !== formData.province && 
    !formData.otherProvinces?.includes(p)
  );

  const addOtherProvince = (p: string) => {
    setFormData((prev) => ({
      ...prev,
      otherProvinces: [...(prev.otherProvinces || []), p]
    }));
    setOtherProvinceSearch("");
    setShowOtherSuggestions(false);
  };

  const removeOtherProvince = (p: string) => {
    setFormData((prev) => ({
      ...prev,
      otherProvinces: prev.otherProvinces?.filter(item => item !== p)
    }));
  };

  useEffect(() => {
    fetchInitialData();
    if (isEditMode) {
      fetchTourDetail();
    }
  }, [id]);

  const fetchInitialData = async () => {
    try {
      const [catRes, accRes, provRes] = await Promise.all([
        tourService.getCategories(),
        getAllAccommodations(),
        supabase.from('provinces').select('name').order('name')
      ]);

      if (catRes && catRes.data) setCategories(catRes.data);
      else if (Array.isArray(catRes)) setCategories(catRes);

      if (accRes && accRes.data) setAllAccommodations(accRes.data);

      if (provRes.data) {
        // Làm sạch tên tỉnh (loại bỏ Tỉnh, Thành phố, TP.)
        const cleanedProvinces = provRes.data.map(p => 
          p.name.replace(/^(Tỉnh|Thành phố|TP\.)\s+/i, '')
        ).sort();
        setProvinces(cleanedProvinces);
      }
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    }
  };

  const fetchTourDetail = async () => {
    try {
      setLoading(true);
      const response = await tourService.getTourDetailForGuide(id!);
      const tour = response.data || response;
      const province = tour.province || "";

      setProvinceSearch(province);

      setFormData((prev) => ({
        ...prev,
        title: tour.title || "",
        categoryId: (tour.category_id || tour.categoryId || "").toString(),
        description: tour.description || "",
        participantRequirements: tour.participant_requirements || tour.participantRequirements || "",
        province: province,
        otherProvinces: tour.other_provinces || tour.otherProvinces || [],
        district: tour.district || "",
        startDate: (tour.start_date || tour.startDate)
          ? new Date(tour.start_date || tour.startDate).toISOString().split("T")[0]
          : "",
        endDate: (tour.end_date || tour.endDate)
          ? new Date(tour.end_date || tour.endDate).toISOString().split("T")[0]
          : "",
        price: tour.price ? Number(tour.price) : 0,
        maxParticipants: tour.max_participants || tour.maxParticipants || 10,
        meetPoint: tour.meet_point || tour.meetPoint || "",
        meetAddress: tour.meet_address || tour.meetAddress || "",
        meetTime: tour.meet_time || tour.meetTime || "",
        googleMapsLink: tour.google_maps_link || tour.googleMapsLink || "",
        duration: tour.duration || "",
        itinerary: tour.tour_locations ? tour.tour_locations.map((loc: any) => ({
          locationName: loc.location_name || '',
          address: loc.address || '',
          visitTime: loc.visit_time ? new Date(loc.visit_time).toISOString().slice(0, 16) : '',
          notes: loc.notes || '',
          hasBreakfast: !!loc.has_breakfast,
          hasLunch: !!loc.has_lunch,
          hasDinner: !!loc.has_dinner,
          accommodation: loc.accommodation_info || '',
          note: loc.highlight_note || '',
          latitude: loc.latitude,
          longitude: loc.longitude
        })) : [],
        destinations: tour.tour_destinations ? tour.tour_destinations.map((d: any) => ({
          name: d.name || '',
          address: d.address || '',
          googleMapsLink: d.google_maps_link || ''
        })) : [],
        routeMapLink: tour.route_map_link || "",
        numDays: tour.num_days ?? tour.numDays ?? "",
        numNights: tour.num_nights ?? tour.numNights ?? "",
        meetLatitude: tour.meet_latitude ?? tour.meetLatitude ?? "",
        meetLongitude: tour.meet_longitude ?? tour.meetLongitude ?? "",
        images: tour.tour_images ? tour.tour_images.map((img: any) => ({
          imageUrl: img.image_url,
          caption: img.caption || "",
          isCover: img.is_cover
        })) : [],
        accommodations: tour.tour_accommodations ? tour.tour_accommodations.map((acc: any) => ({
          accommodationId: acc.accommodation_id,
          name: acc.accommodations?.name || "",
          checkInDate: acc.check_in_date ? new Date(acc.check_in_date).toISOString().split("T")[0] : "",
          checkOutDate: acc.check_out_date ? new Date(acc.check_out_date).toISOString().split("T")[0] : "",
          notes: acc.notes || ""
        })) : [],
        visibilityStatus: tour.visibility_status || tour.visibilityStatus || "visible",
        businessStatus: tour.business_status || tour.businessStatus || "draft",
      }));

      if (tour._count) {
        setParticipantCount(tour._count.tour_requests || 0);
      }
    } catch (error) {
      console.error("Failed to fetch tour detail:", error);
      toast.error("Không tìm thấy thông tin tour");
      navigate("/guide/tours");
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleBasicChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" ||
        name === "maxParticipants" ||
        name === "numDays" ||
        name === "numNights" ||
        name.includes("Latitude") ||
        name.includes("Longitude")
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  const isStepComplete = (step: number): boolean => {
    if (step === 1) {
      return !!(formData.title && formData.categoryId && formData.price !== undefined && formData.price >= 0);
    }
    if (step === 2) {
      const datesValid =
        formData.startDate && formData.endDate
          ? new Date(formData.endDate) >= new Date(formData.startDate)
          : true;

      return !!(
        formData.province &&
        formData.numDays &&
        formData.numNights !== undefined &&
        formData.startDate &&
        formData.endDate &&
        datesValid &&
        formData.meetPoint &&
        formData.meetAddress &&
        formData.meetTime
      );
    }
    if (step === 3) {
      return formData.itinerary.length > 0 && !!formData.itinerary[0].locationName;
    }
    if (step === 4) {
      return formData.destinations.length > 0 && !!formData.destinations[0].name;
    }
    if (step === 5) {
      return formData.images.length > 0;
    }
    return true;
  };
  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.title || !formData.categoryId || !formData.price || formData.price <= 0 || !formData.province) {
        toast.warning("Vui lòng điền đầy đủ các trường bắt buộc (Tiêu đề, Danh mục, Giá, Tỉnh thành)");
        return false;
      }
    }
    if (step === 2) {
      if (
        !formData.numDays ||
        formData.numNights === undefined ||
        !formData.startDate ||
        !formData.endDate ||
        !formData.meetPoint ||
        !formData.meetAddress ||
        !formData.meetTime
      ) {
        toast.warning(
          "Vui lòng điền đầy đủ thông tin địa điểm, thời gian và điểm hẹn",
        );
        return false;
      }
    }
    if (step === 3) {
      if (formData.itinerary.length === 0 || !formData.itinerary[0].locationName) {
        toast.warning("Vui lòng mô tả lịch trình chi tiết ít nhất 1 ngày");
        return false;
      }
    }
    if (step === 4) {
      if (formData.destinations.length === 0 || !formData.destinations[0].name) {
        toast.warning("Vui lòng thêm ít nhất 1 địa điểm ghé thăm");
        return false;
      }
    }
    if (step === 5) {
      if (formData.images.length === 0) {
        toast.warning("Vui lòng tải lên ít nhất 1 hình ảnh cho tour");
        return false;
      }
    }
    return true;
  };

  const addDestinationItem = () => {
    setFormData((prev) => ({
      ...prev,
      destinations: [
        ...prev.destinations,
        { name: "", address: "", googleMapsLink: "" },
      ],
    }));
  };

  const removeDestinationItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      destinations: prev.destinations.filter((_, i) => i !== index),
    }));
  };

  const handleDestinationChange = async (index: number, field: keyof DestinationItem, value: string) => {
    const newDestinations = [...formData.destinations];
    const currentItem = { ...newDestinations[index], [field]: value };
    
    // Auto-extract coordinates if link is pasted
    if (field === "googleMapsLink" && value) {
      const coords = extractLatLng(value);
      if (coords) {
        currentItem.lat = coords.lat;
        currentItem.lng = coords.lng;
        toast.success(`Đã lấy được tọa độ cho ${currentItem.name || "địa điểm"}`);
      } else if (value.includes('maps.app.goo.gl') || value.includes('goo.gl')) {
        // Fallback to Nominatim for short links
        const query = `${currentItem.name} ${currentItem.address}`;
        if (currentItem.name || currentItem.address) {
          const geo = await fetchFromNominatim(query);
          if (geo) {
            currentItem.lat = geo.lat;
            currentItem.lng = geo.lng;
            toast.success(`Tự động tìm thấy vị trí cho ${currentItem.name || "địa điểm"}`);
          }
        }
      }
    }
    
    newDestinations[index] = currentItem;
    setFormData({ ...formData, destinations: newDestinations });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    setHoveredIndex(index);
    e.dataTransfer.effectAllowed = "move";
    
    // Create a slight delay for the ghost effect
    setTimeout(() => {
      const target = e.currentTarget as HTMLElement;
      target.classList.add('tc-itinerary-card--ghost');
    }, 0);
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null) return;
    setHoveredIndex(index);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('tc-itinerary-card--ghost');
    
    if (draggedIndex !== null && hoveredIndex !== null && draggedIndex !== hoveredIndex) {
      const newDestinations = [...formData.destinations];
      const draggedItem = newDestinations[draggedIndex];
      
      newDestinations.splice(draggedIndex, 1);
      newDestinations.splice(hoveredIndex, 0, draggedItem);
      
      setFormData({ ...formData, destinations: newDestinations });
      toast.success("Đã cập nhật lại thứ tự địa điểm");
    }
    
    setDraggedIndex(null);
    setHoveredIndex(null);
  };

  // Itinerary Handlers
  const addItineraryItem = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { 
          locationName: "", 
          address: "", 
          visitTime: "", 
          notes: "",
          hasBreakfast: false,
          hasLunch: false,
          hasDinner: false,
          accommodation: "",
          note: ""
        },
      ],
    }));
  };

  const removeItineraryItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((_, i) => i !== index),
    }));
  };

  const handleItineraryChange = (
    index: number,
    field: keyof ItineraryItem,
    value: any,
  ) => {
    setFormData((prev) => {
      const newItinerary = [...prev.itinerary];
      newItinerary[index] = { ...newItinerary[index], [field]: value };
      return { ...prev, itinerary: newItinerary };
    });
  };

  // Image Handlers
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const newImages = [...formData.images];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `tours/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("tours")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("tours").getPublicUrl(filePath);

        newImages.push({
          imageUrl: publicUrl,
          caption: "",
          isCover: newImages.length === 0,
        });
      }

      setFormData((prev) => ({ ...prev, images: newImages }));
      toast.success("Tải ảnh thành công");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Không thể tải ảnh lên");
    } finally {
      setUploading(false);
    }
  };

  const setCoverImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({ ...img, isCover: i === index })),
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Accommodation Handlers
  const addAccommodation = () => {
    setFormData((prev) => ({
      ...prev,
      accommodations: [
        ...prev.accommodations,
        {
          accommodationId: "",
          name: "",
          checkInDate: "",
          checkOutDate: "",
          notes: "",
        },
      ],
    }));
  };

  const handleAccChange = (
    index: number,
    field: keyof AccommodationItem,
    value: string,
  ) => {
    setFormData((prev) => {
      const newAccs = [...prev.accommodations];
      newAccs[index] = { ...newAccs[index], [field]: value };
      return { ...prev, accommodations: newAccs };
    });
  };

  const handleSaveDraft = async () => {
    try {
      if (!isStepComplete(1)) {
        toast.warning("Vui lòng hoàn thành ít nhất bước 1 (Thông tin cơ bản) để lưu bản nháp");
        setCurrentStep(1);
        return;
      }

      // Kiểm tra ngày nếu cả hai đều có
      if (formData.startDate && formData.endDate) {
        if (new Date(formData.endDate) < new Date(formData.startDate)) {
          toast.error("Ngày kết thúc không thể trước ngày bắt đầu");
          setCurrentStep(2);
          return;
        }
      }

      setSubmitting(true);
      const draftData = { ...formData, businessStatus: 'draft' };
      
      if (isEditMode) {
        await tourService.updateTour(id!, draftData);
      } else {
        await tourService.createTour(draftData);
      }
      
      toast.success("Đã lưu bản nháp thành công!");
      navigate("/guide/tours");
    } catch (error) {
      console.error("Save draft error:", error);
      toast.error("Không thể lưu bản nháp");
    } finally {
      setSubmitting(false);
    }
  };

  const executeSubmit = async (statusOverride?: string) => {
    try {
      setSubmitting(true);
      const finalData = { ...formData };
      if (statusOverride) {
        finalData.businessStatus = statusOverride;
        if (statusOverride === 'published') {
          finalData.visibilityStatus = 'visible';
        }
      }

      if (isEditMode) {
        await tourService.updateTour(id!, finalData);
        toast.success(statusOverride === 'published' ? "Chúc mừng! Tour của bạn đã được đăng thành công." : "Cập nhật tour thành công!");
      } else {
        await tourService.createTour(finalData);
        toast.success(statusOverride === 'published' ? "Chúc mừng! Tour của bạn đã được đăng thành công." : "Tour đã được lưu thành công.");
      }
      navigate("/guide/tours");
    } catch (error) {
      console.error("Failed to save tour:", error);
      toast.error("Có lỗi xảy ra khi lưu thông tin tour");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Logic cho Tour đã đăng (Quản lý)
    if (wasPublished.current || isPublished) {
      if (formData.maxParticipants <= participantCount) {
        toast.error(`Số lượng khách tối đa phải lớn hơn số khách hiện tại (${participantCount})`);
        return;
      }
      if (formData.maxParticipants > 20) {
        toast.error("Số lượng khách tối đa không được vượt quá 20");
        return;
      }
      executeSubmit();
      return;
    }

    // Xác định trạng thái sẽ lưu (ưu tiên selectedAction, nếu chưa chọn thì lấy từ formData)
    const targetStatus = selectedAction || formData.businessStatus;

    if (targetStatus === 'published') {
      // Kiểm tra đầy đủ 5 bước
      for (let i = 1; i <= 5; i++) {
        if (!validateStep(i)) {
          setCurrentStep(i);
          return;
        }
      }
      setShowPublishConfirm(true);
    } else {
      // Lưu nháp chỉ cần kiểm tra bước 1 (cơ bản)
      if (!validateStep(1)) {
        setCurrentStep(1);
        return;
      }
      executeSubmit('draft');
    }
  };

  if (loading) return <div className="tc-loading">Đang tải thông tin...</div>;

  return (
    <div className="tc-tour-form">
      <div className="tc-tour-form__header">
        <h1>{isEditMode ? "Chỉnh sửa tinh hoa" : "Khởi tạo hành trình"}</h1>
        <p>Kiến tạo những trải nghiệm khó quên cho du khách của bạn</p>
      </div>

      <div className="tc-tour-form__layout">
        <aside className="tc-tour-form__sidebar">
          <div className="tc-stepper">
            {[
              { n: 1, t: "Thông tin cơ bản", d: "Tiêu đề, loại hình & giá" },
              { n: 2, t: "Địa điểm & Thời gian", d: "Điểm hẹn & tọa độ" },
              { n: 3, t: "Mô tả lịch trình chi tiết", d: "Nội dung tour" },
              { n: 4, t: "Các địa điểm ghé thăm", d: "Danh sách điểm dừng" },
              { n: 5, t: "Hình ảnh & Truyền thông", d: "Album ảnh tour" },
            ].map((s) => {
              const completed = isStepComplete(s.n);
              return (
                <div
                  key={s.n}
                  className={`tc-step ${currentStep === s.n ? "tc-step--active" : ""} ${completed ? "tc-step--completed" : "tc-step--incomplete"}`}
                  onClick={() => handleStepChange(s.n)}
                >
                  <div className="tc-step__number">
                    {completed ? "✓" : s.n}
                  </div>
                  <div className="tc-step__label">
                    <span className="tc-step__title">{s.t}</span>
                    <span className="tc-step__desc">{s.d}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <main className="tc-tour-form__content">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Core Data */}
            {currentStep === 1 && (
              <div className="tc-step-content">
                <h2>Thông tin cơ bản</h2>
                <p>Bắt đầu với những thông tin cốt lõi nhất của tour.</p>

                <div className="tc-form-group">
                  <label>
                    Tiêu đề Tour <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="tc-form-input"
                    value={formData.title}
                    onChange={handleBasicChange}
                    placeholder="VD: Khám phá kỳ quan Vịnh Hạ Long 2 ngày 1 đêm"
                    required
                    disabled={isPublished}
                  />
                </div>

                <div className="tc-tour-form__grid">
                  <div
                    className="tc-form-group"
                    style={{ position: "relative" }}
                  >
                    <label>
                      Tỉnh / Thành phố chính <span>*</span>
                    </label>
                    <input
                      type="text"
                      className="tc-form-input"
                      value={provinceSearch || formData.province}
                      onChange={(e) => {
                        setProvinceSearch(e.target.value);
                        setShowProvinceSuggestions(true);
                      }}
                      onFocus={() => setShowProvinceSuggestions(true)}
                      placeholder="Chọn Tỉnh / Thành chính"
                      required
                      disabled={isPublished}
                    />
                    {showProvinceSuggestions && provinceSearch && (
                      <div
                        className="tc-province-suggestions"
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          background: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          marginTop: "4px",
                          maxHeight: "200px",
                          overflowY: "auto",
                          zIndex: 100,
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {filteredProvinces.map((p) => (
                          <div
                            key={p}
                            style={{ padding: "10px 16px", cursor: "pointer" }}
                            onClick={() => selectProvince(p)}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#f1f5f9")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.backgroundColor = "white")
                            }
                          >
                            {p}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div
                    className="tc-form-group"
                    style={{ position: "relative" }}
                  >
                    <label>Các tỉnh khác</label>
                    <input
                      type="text"
                      className="tc-form-input"
                      value={otherProvinceSearch}
                      onChange={(e) => {
                        setOtherProvinceSearch(e.target.value);
                        setShowOtherSuggestions(true);
                      }}
                      onFocus={() => setShowOtherSuggestions(true)}
                      placeholder="Tìm và thêm tỉnh khác..."
                      disabled={isPublished}
                    />
                    {showOtherSuggestions && otherProvinceSearch && (
                      <div
                        className="tc-province-suggestions"
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          background: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          marginTop: "4px",
                          maxHeight: "200px",
                          overflowY: "auto",
                          zIndex: 100,
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {filteredOtherProvinces.map((p) => (
                          <div
                            key={p}
                            style={{ padding: "10px 16px", cursor: "pointer" }}
                            onClick={() => addOtherProvince(p)}
                            onMouseOver={(e) =>
                              (e.currentTarget.style.backgroundColor =
                                "#f1f5f9")
                            }
                            onMouseOut={(e) =>
                              (e.currentTarget.style.backgroundColor = "white")
                            }
                          >
                            {p}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="tc-selected-provinces" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                      {formData.otherProvinces?.map(p => (
                        <span key={p} style={{ 
                          background: '#f1f5f9', 
                          padding: '4px 10px', 
                          borderRadius: '20px', 
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {p}
                          {!isPublished && (
                            <span 
                              style={{ cursor: 'pointer', fontWeight: 'bold', color: '#64748b' }} 
                              onClick={() => removeOtherProvince(p)}
                            >×</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="tc-tour-form__grid">
                  <div className="tc-form-group">
                    <label>
                      Loại hình tour <span>*</span>
                    </label>
                    <select
                      name="categoryId"
                      className="tc-form-select"
                      value={formData.categoryId}
                      onChange={handleBasicChange}
                      required
                      disabled={isPublished}
                    >
                      <option value="">Chọn loại hình</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="tc-form-group">
                    <label>
                      Giá tour (VND/khách) <span>*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      className="tc-form-input"
                      value={formData.price ?? ""}
                      onChange={handleBasicChange}
                      min="0"
                      step="10000"
                      required
                      disabled={isPublished}
                    />
                  </div>
                </div>

                <div className="tc-form-group">
                  <label>
                    Số lượng khách tối đa <span>*</span>
                  </label>
                  <input
                    type="number"
                    name="maxParticipants"
                    className="tc-form-input"
                    value={formData.maxParticipants ?? ""}
                    onChange={handleBasicChange}
                    min="1"
                    required
                  />
                </div>

                <div className="tc-form-group">
                  <label>
                    Mô tả tổng quan <span>*</span>
                  </label>
                  <textarea
                    name="description"
                    className="tc-form-textarea"
                    value={formData.description}
                    onChange={handleBasicChange}
                    required
                    disabled={isPublished}
                  />
                </div>

                <div className="tc-form-group">
                  <label>Yêu cầu đối với khách</label>
                  <textarea
                    name="participantRequirements"
                    className="tc-form-textarea"
                    value={formData.participantRequirements}
                    onChange={handleBasicChange}
                    disabled={isPublished}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Location & Time */}
            {currentStep === 2 && (
              <div className="tc-step-content">
                <h2>Địa điểm & Thời gian</h2>
                <p>Xác định không gian và thời gian của hành trình.</p>

                <div className="tc-tour-form__grid">
                  <div className="tc-form-group">
                    <label>
                      Số ngày <span>*</span>
                    </label>
                      <input
                        type="number"
                        name="numDays"
                        className="tc-form-input"
                        value={formData.numDays ?? ""}
                        onChange={handleBasicChange}
                        min="1"
                        required
                        disabled={isPublished}
                      />
                    </div>
                    <div className="tc-form-group">
                      <label>
                        Số đêm <span>*</span>
                      </label>
                      <input
                        type="number"
                        name="numNights"
                        className="tc-form-input"
                        value={formData.numNights ?? ""}
                        onChange={handleBasicChange}
                        min="0"
                        required
                      />
                    </div>
                  </div>

                <div className="tc-tour-form__grid">
                  <div className="tc-form-group">
                    <label>
                      Ngày bắt đầu <span>*</span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      className="tc-form-input"
                      value={formData.startDate}
                      onChange={handleBasicChange}
                      required
                      disabled={isPublished}
                    />
                  </div>
                  <div className="tc-form-group">
                    <label>
                      Ngày kết thúc <span>*</span>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      className="tc-form-input"
                      value={formData.endDate}
                      onChange={handleBasicChange}
                      required
                      disabled={isPublished}
                    />
                  </div>
                </div>

                <div className="tc-form-group">
                  <label>
                    Tên điểm hẹn tập trung <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="meetPoint"
                    className="tc-form-input"
                    value={formData.meetPoint}
                    onChange={handleBasicChange}
                    required
                    disabled={isPublished}
                  />
                </div>

                <div className="tc-tour-form__grid">
                  <div className="tc-form-group">
                    <label>
                      Địa chỉ điểm hẹn <span>*</span>
                    </label>
                    <input
                      type="text"
                      name="meetAddress"
                      className="tc-form-input"
                      value={formData.meetAddress}
                      onChange={handleBasicChange}
                      required
                      disabled={isPublished}
                    />
                  </div>
                  <div className="tc-form-group">
                    <label>
                      Giờ có mặt tại điểm hẹn <span>*</span>
                    </label>
                    <input
                      type="time"
                      name="meetTime"
                      className="tc-form-input"
                      value={formData.meetTime}
                      onChange={handleBasicChange}
                      required
                      disabled={isPublished}
                    />
                  </div>
                </div>

                <div className="tc-form-group">
                  <label>Link Google Map điểm hẹn</label>
                  <input
                    type="url"
                    name="googleMapsLink"
                    className="tc-form-input"
                    value={formData.googleMapsLink}
                    onChange={handleBasicChange}
                  />
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--tc-text-secondary)",
                      marginTop: "4px",
                    }}
                  >
                    💡 Link này sẽ giúp khách dễ dàng tìm đường đến điểm tập
                    trung.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Itinerary */}
            {currentStep === 3 && (
              <div className="tc-step-content">
                <h2>Mô tả lịch trình chi tiết</h2>
                <p>Xây dựng lộ trình từng bước cho du khách.</p>

                <div className="tc-itinerary-list">
                  {formData.itinerary.map((item, index) => (
                    <div key={index} className="tc-itinerary-card">
                      <div className="tc-itinerary-card__header">
                        <div className="tc-itinerary-card__index">
                          Ngày {index + 1}
                        </div>
                        {!isPublished && (
                          <Button
                            variant="danger"
                            size="small"
                            onClick={() => removeItineraryItem(index)}
                          >
                            Xóa ngày này
                          </Button>
                        )}
                      </div>
                      
                      <div className="tc-form-group">
                        <label>Tiêu đề của ngày {index + 1} <span>*</span></label>
                        <input 
                          type="text" 
                          className="tc-form-input" 
                          value={item.locationName} 
                          onChange={(e) => handleItineraryChange(index, "locationName", e.target.value)} 
                          placeholder={`VD: Ngày ${index + 1}: Khám phá vườn hoa thành phố`}
                          required
                          disabled={isPublished}
                        />
                      </div>

                      <div className="tc-form-group">
                        <label>Bữa ăn trong ngày</label>
                        <div className="tc-meal-options">
                          <button 
                            type="button"
                            className={`tc-meal-btn ${item.hasBreakfast ? 'active' : ''}`}
                            onClick={() => handleItineraryChange(index, 'hasBreakfast', !item.hasBreakfast)}
                            disabled={isPublished}
                          >
                            🍳 Ăn sáng
                          </button>
                          <button 
                            type="button"
                            className={`tc-meal-btn ${item.hasLunch ? 'active' : ''}`}
                            onClick={() => handleItineraryChange(index, 'hasLunch', !item.hasLunch)}
                            disabled={isPublished}
                          >
                            🍲 Ăn trưa
                          </button>
                          <button 
                            type="button"
                            className={`tc-meal-btn ${item.hasDinner ? 'active' : ''}`}
                            onClick={() => handleItineraryChange(index, 'hasDinner', !item.hasDinner)}
                            disabled={isPublished}
                          >
                            🍱 Ăn tối
                          </button>
                        </div>
                      </div>

                      <div className="tc-form-group">
                        <label>Nội dung chi tiết <span>*</span></label>
                        <textarea
                          className="tc-form-textarea"
                          style={{ minHeight: "200px", lineHeight: "1.6", whiteSpace: "pre-wrap" }}
                          value={item.notes}
                          onChange={(e) =>
                            handleItineraryChange(
                              index,
                              "notes",
                              e.target.value,
                            )
                          }
                          placeholder="Mô tả chi tiết các hoạt động, chặng dừng chân trong ngày... (Hỗ trợ xuống dòng, tab, gạch đầu dòng...)"
                          required
                        />
                      </div>

                      <div className="tc-tour-form__grid">
                        <div className="tc-form-group">
                          <label>Nghỉ đêm tại</label>
                          <input 
                            type="text" 
                            className="tc-form-input" 
                            value={item.accommodation || ''} 
                            onChange={(e) => handleItineraryChange(index, 'accommodation', e.target.value)}
                            placeholder="VD: Khách sạn 3 sao tại Đà Lạt"
                          />
                        </div>
                        <div className="tc-form-group">
                          <label>Lưu ý / Highlight</label>
                          <input 
                            type="text" 
                            className="tc-form-input" 
                            value={item.note || ''} 
                            onChange={(e) => handleItineraryChange(index, 'note', e.target.value)}
                            placeholder="VD: Nên mang theo áo khoác mỏng"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    type="button"
                    fullWidth
                    onClick={addItineraryItem}
                  >
                    + Thêm mô tả cho ngày tiếp theo
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Visited Locations */}
            {currentStep === 4 && (
              <div className="tc-step-content">
                <h2>Các địa điểm ghé thăm</h2>
                <p>Liệt kê các điểm dừng chân nổi bật trong hành trình.</p>

                <div className="tc-itinerary-list">
                  {formData.destinations.map((item, index) => (
                    <div 
                      key={index} 
                      className="tc-itinerary-card"
                      draggable={!isPublished && canDrag}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragEnter={() => handleDragEnter(index)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => e.preventDefault()}
                      style={{ 
                        transform: (draggedIndex !== null && hoveredIndex !== null) ? (
                          index > draggedIndex && index <= hoveredIndex ? `translateY(calc(-100% - 20px))` :
                          index < draggedIndex && index >= hoveredIndex ? `translateY(calc(100% + 20px))` : 'none'
                        ) : 'none',
                        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: draggedIndex === index ? 100 : 1
                      }}
                    >
                      <div className="tc-itinerary-card__header">
                        <div className="tc-itinerary-card__index">
                          Điểm {index + 1}
                        </div>
                        <div className="tc-itinerary-card__actions">
                          {!isPublished && (
                            <Button
                              variant="danger"
                              size="small"
                              onClick={() => removeDestinationItem(index)}
                              style={{ marginRight: '12px' }}
                            >
                              Xóa
                            </Button>
                          )}
                          {!isPublished && (
                            <div 
                              className="tc-drag-handle" 
                              title="Kéo để sắp xếp lại"
                              onMouseEnter={() => setCanDrag(true)}
                              onMouseLeave={() => setCanDrag(false)}
                            >
                              ⋮⋮
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="tc-form-group">
                        <label>Tên địa điểm <span>*</span></label>
                        <input
                          type="text"
                          className="tc-form-input"
                          value={item.name}
                          onChange={(e) => handleDestinationChange(index, "name", e.target.value)}
                          placeholder="VD: Vườn hoa Thành phố Đà Lạt"
                          required
                          disabled={isPublished}
                        />
                      </div>

                      <div className="tc-tour-form__grid">
                        <div className="tc-form-group">
                          <label>Địa chỉ cụ thể</label>
                          <input
                            type="text"
                            className="tc-form-input"
                            value={item.address}
                            onChange={(e) => handleDestinationChange(index, "address", e.target.value)}
                            placeholder="VD: 02 Trần Nhân Tông, Phường 8"
                          />
                        </div>
                        <div className="tc-form-group">
                          <label>Link Google Maps</label>
                          <input
                            type="text"
                            className="tc-form-input"
                            value={item.googleMapsLink}
                            onChange={(e) => handleDestinationChange(index, "googleMapsLink", e.target.value)}
                            placeholder="Dán link Google Maps tại đây"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    type="button"
                    fullWidth
                    onClick={addDestinationItem}
                  >
                    + Thêm địa điểm ghé thăm
                  </Button>

                  <div className="tc-form-group" style={{ marginTop: '40px' }}>
                    <label>Link toàn bộ lộ trình (Google Maps)</label>
                    <input
                      type="text"
                      className="tc-form-input"
                      value={formData.routeMapLink}
                      onChange={(e) => setFormData({ ...formData, routeMapLink: e.target.value })}
                      placeholder="VD: https://www.google.com/maps/dir/..."
                    />
                    <p style={{ fontSize: '0.85rem', color: 'var(--tc-text-secondary)', marginTop: '8px' }}>
                      Cung cấp bản đồ lộ trình tổng quát để du khách dễ hình dung.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Media */}
            {currentStep === 5 && (
              <div className="tc-step-content">
                <h2>Hình ảnh & Truyền thông</h2>
                <p>Hình ảnh chất lượng giúp tăng khả năng đặt tour lên 80%.</p>

                <div className="tc-media-upload">
                  {formData.images.map((img, index) => (
                    <div key={index} className="tc-image-preview">
                      <img src={img.imageUrl} alt="Tour" />
                      <div className="tc-image-preview__overlay">
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Button
                            variant={img.isCover ? "primary" : "outline"}
                            size="small"
                            onClick={() => setCoverImage(index)}
                          >
                            {img.isCover ? "Ảnh bìa" : "Làm bìa"}
                          </Button>
                          <Button
                            variant="danger"
                            size="small"
                            onClick={() => removeImage(index)}
                          >
                            Xóa
                          </Button>
                        </div>
                      </div>
                      {img.isCover && (
                        <div
                          style={{
                            position: "absolute",
                            top: "10px",
                            left: "10px",
                            background: "var(--tc-primary)",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "0.7rem",
                          }}
                        >
                          Ảnh bìa
                        </div>
                      )}
                    </div>
                  ))}

                  <div
                    className="tc-upload-placeholder"
                    style={{ minHeight: "150px" }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span style={{ fontSize: "2rem" }}>
                      {uploading ? "⌛" : "📸"}
                    </span>
                    <span>{uploading ? "Đang tải..." : "Thêm ảnh"}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      ref={fileInputRef}
                      hidden
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>
            )}



            <div className="tc-tour-form__footer">
              <Button
                variant="outline"
                type="button"
                onClick={() =>
                  currentStep > 1
                    ? setCurrentStep(currentStep - 1)
                    : navigate("/guide/tours")
                }
              >
                {currentStep === 1 ? "Hủy bỏ" : "Quay lại"}
              </Button>

              <div style={{ display: 'flex', gap: '12px' }}>
                {currentStep < 5 && (
                  <Button
                    variant="primary"
                    type="button"
                    onClick={() => {
                      if (validateStep(currentStep)) {
                        handleStepChange(currentStep + 1);
                      }
                    }}
                  >
                    Tiếp theo
                  </Button>
                )}
              </div>
            </div>
          </form>
        </main>

        <aside className="tc-tour-form__settings">
          <div className="tc-settings-dashboard">
            <div className="tc-dashboard-card tc-status-overview">
              <div className="tc-dashboard-card__icon">{statusInfo.icon}</div>
              <div className="tc-dashboard-card__info">
                <span className="tc-dashboard-label">Trạng thái hiện tại</span>
                <span className="tc-dashboard-value" style={{ color: statusInfo.color }}>
                  {statusInfo.label}
                </span>
              </div>
            </div>

            <div className="tc-dashboard-card tc-participants-count">
              <div className="tc-dashboard-card__icon">👥</div>
              <div className="tc-dashboard-card__info">
                <span className="tc-dashboard-label">Khách đã tham gia</span>
                <span className="tc-dashboard-value">
                  {participantCount} / {formData.maxParticipants || 0}
                </span>
              </div>
              <div className="tc-progress-bar">
                <div 
                  className="tc-progress-fill" 
                  style={{ width: `${Math.min(100, (participantCount / (formData.maxParticipants || 1)) * 100)}%` }}
                ></div>
              </div>

              {(isPublished || wasPublished.current) && (
                <div className="tc-max-participants-update" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--tc-text-secondary)', display: 'block', marginBottom: '8px' }}>
                    Cập nhật số lượng khách tối đa
                  </label>
                  <input 
                    type="number" 
                    className="tc-form-input"
                    style={{ padding: '8px 12px' }}
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                    min={participantCount + 1}
                    max={20}
                  />
                  <p style={{ fontSize: '0.7rem', color: 'var(--tc-text-secondary)', marginTop: '4px' }}>
                    * Từ {participantCount + 1} đến 20
                  </p>
                </div>
              )}
            </div>

            <div className="tc-settings-actions-grid" style={(isPublished || wasPublished.current) ? { gridTemplateColumns: 'repeat(3, 1fr)' } : {}}>
              {!(isPublished || wasPublished.current) && (
                <>
                  <div 
                    className={`tc-action-card ${selectedAction === 'draft' || (!selectedAction && formData.businessStatus === 'draft') ? 'active' : ''}`}
                    onClick={() => setSelectedAction('draft')}
                  >
                    <div className="tc-action-card__icon">💾</div>
                    <div className="tc-action-card__label">Lưu Nháp</div>
                  </div>

                  <div 
                    className={`tc-action-card ${selectedAction === 'published' ? 'active' : ''}`}
                    onClick={() => setSelectedAction('published')}
                  >
                    <div className="tc-action-card__icon">🌐</div>
                    <div className="tc-action-card__label">Đăng bài</div>
                  </div>
                </>
              )}

              {(isPublished || wasPublished.current) && (
                <>
                  {formData.businessStatus === 'closed' && formData.visibilityStatus === 'hidden' ? (
                    <div 
                      className="tc-action-card" 
                      onClick={() => setFormData({ ...formData, businessStatus: 'published', visibilityStatus: 'visible' })}
                    >
                      <div className="tc-action-card__icon">🚀</div>
                      <div className="tc-action-card__label">Mở ĐK</div>
                    </div>
                  ) : (
                    <div 
                      className={`tc-action-card ${formData.businessStatus === 'closed' && formData.visibilityStatus === 'hidden' ? 'active' : ''}`} 
                      onClick={() => setFormData({ ...formData, businessStatus: 'closed', visibilityStatus: 'hidden' })}
                    >
                      <div className="tc-action-card__icon">⏸️</div>
                      <div className="tc-action-card__label">Tạm ngưng</div>
                    </div>
                  )}
                  
                  <div 
                    className={`tc-action-card ${formData.businessStatus === 'closed' && formData.visibilityStatus === 'visible' ? 'active' : ''}`} 
                    onClick={() => setFormData({ ...formData, businessStatus: 'closed', visibilityStatus: 'visible' })}
                  >
                    <div className="tc-action-card__icon">🔒</div>
                    <div className="tc-action-card__label">Đóng ĐK</div>
                  </div>
                  <div 
                    className={`tc-action-card ${formData.businessStatus === 'cancelled' ? 'active' : ''}`} 
                    onClick={() => setFormData({ ...formData, businessStatus: 'cancelled' })}
                  >
                    <div className="tc-action-card__icon">🗑️</div>
                    <div className="tc-action-card__label">Hủy</div>
                  </div>
                </>
              )}
            </div>

            <div className="tc-final-actions">
              <Button 
                variant="primary" 
                fullWidth 
                type="button" 
                onClick={handleSubmit}
                isLoading={submitting}
              >
                Xác nhận
              </Button>

              <Button 
                variant="outline" 
                fullWidth 
                type="button" 
                onClick={() => navigate("/guide/tours")}
              >
                Thoát
              </Button>
            </div>
          </div>
        </aside>
      </div>

      <Modal
        isOpen={showPublishConfirm}
        onClose={() => setShowPublishConfirm(false)}
        title="Xác nhận đăng bài"
        footer={
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="outline" onClick={() => setShowPublishConfirm(false)}>Hủy</Button>
            <Button variant="primary" onClick={() => {
              setShowPublishConfirm(false);
              executeSubmit('published');
            }}>Xác nhận</Button>
          </div>
        }
      >
        <div style={{ padding: '8px 0' }}>
          <p style={{ marginBottom: '16px', lineHeight: '1.6' }}>
            Bạn có chắc chắn muốn đăng tải bài này và bắt đầu để khách hàng đăng ký không?
          </p>
          <div style={{ 
            padding: '12px', 
            background: '#fff7ed', 
            borderLeft: '4px solid #f97316',
            borderRadius: '4px'
          }}>
            <p style={{ fontSize: '0.9rem', color: '#9a3412', fontWeight: '500' }}>
              <strong>Lưu ý:</strong> Khi xác nhận sẽ không được chỉnh sửa nội dung nào của tour nữa trừ <strong>Số lượng khách tối đa</strong>.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TourFormPage;
