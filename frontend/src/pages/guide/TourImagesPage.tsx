import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tourService } from '../../services/tourService';
import { supabase } from '../../utils/supabase';
import { Button } from '../../components/common/Button/Button';
import { useToast } from '../../contexts/ToastContext';
import './TourImagesPage.css';

interface TourImage {
  id?: string;
  imageUrl: string;
  caption: string;
  isCover: boolean;
}

const TourImagesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<TourImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, [id]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await tourService.getTourImages(id!);
      const mappedData = data.map((img: any) => ({
        id: img.id,
        imageUrl: img.image_url,
        caption: img.caption || '',
        isCover: img.is_cover || false
      }));
      setImages(mappedData);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const newImages: TourImage[] = [...images];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${id}/${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('tours')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('tours')
          .getPublicUrl(filePath);

        newImages.push({
          imageUrl: publicUrl,
          caption: '',
          isCover: newImages.length === 0 // Set as cover if it's the first image
        });
      }

      setImages(newImages);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Tải ảnh lên thất bại');
    } finally {
      setUploading(false);
    }
  };

  const setCover = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isCover: i === index
    }));
    setImages(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    // If we removed the cover, set the first one as cover
    if (images[index].isCover && newImages.length > 0) {
      newImages[0].isCover = true;
    }
    setImages(newImages);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await tourService.updateTourImages(id!, images);
      toast.success('Cập nhật thư viện ảnh thành công!');
      navigate('/guide/tours');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Lưu thông tin ảnh thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="tc-loading">Đang tải thư viện ảnh...</div>;

  return (
    <div className="tc-tour-images">
      <div className="tc-tour-images__header">
        <div className="tc-tour-images__title">
          <h1>Quản lý hình ảnh</h1>
          <p>Tải lên những hình ảnh đẹp nhất để thu hút khách du lịch</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/guide/tours')}>
          Quay lại
        </Button>
      </div>

      <div 
        className="tc-tour-images__upload-box" 
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="tc-tour-images__upload-icon">📸</div>
        <h3>{uploading ? 'Đang tải lên...' : 'Nhấn để tải ảnh lên'}</h3>
        <p>Hỗ trợ JPG, PNG. Có thể chọn nhiều ảnh cùng lúc.</p>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          ref={fileInputRef} 
          className="tc-tour-images__upload-input" 
          onChange={handleFileUpload}
          disabled={uploading}
        />
      </div>

      <div className="tc-tour-images__grid">
        {images.map((img, index) => (
          <div key={index} className="tc-image-card">
            <div className="tc-image-card__wrapper">
              <img src={img.imageUrl} alt={`Tour ${index}`} className="tc-image-card__img" />
              {img.isCover && <span className="tc-image-card__badge">Ảnh bìa</span>}
              <button 
                className="tc-image-card__delete" 
                onClick={() => removeImage(index)}
                title="Xóa ảnh"
              >
                ✕
              </button>
            </div>
            <div className="tc-image-card__actions">
              <Button 
                variant={img.isCover ? 'primary' : 'outline'} 
                size="small" 
                fullWidth
                disabled={img.isCover}
                onClick={() => setCover(index)}
              >
                {img.isCover ? 'Đang là ảnh bìa' : 'Đặt làm ảnh bìa'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="tc-tour-images__footer">
        <Button variant="outline" onClick={() => navigate('/guide/tours')}>
          Hủy bỏ
        </Button>
        <Button variant="primary" onClick={handleSave} isLoading={saving} disabled={images.length === 0}>
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

export default TourImagesPage;
