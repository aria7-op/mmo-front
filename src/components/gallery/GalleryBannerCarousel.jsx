import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, Keyboard } from "swiper/modules";
import { useGallery } from "../../hooks/useGallery";
import {
  getImageUrlFromObject,
  formatMultilingualContent,
  getPlaceholderImage,
} from "../../utils/apiUtils";
import { useSlug } from "../../hooks/useSlug";
import LoadingSpinner from "../common/LoadingSpinner";
import GalleryModal from "./GalleryModal";

const GalleryBannerCarousel = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "dr" || i18n.language === "ps";
  const navigate = useNavigate();

  const { galleryItems, loading, error } = useGallery({
    status: "published",
    page: 1,
    limit: 16,
  });

  // Responsive items per slide
  const [itemsPerSlide, setItemsPerSlide] = React.useState(4);
  React.useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      if (w < 576) setItemsPerSlide(1);
      else if (w < 768) setItemsPerSlide(2);
      else if (w < 992) setItemsPerSlide(3);
      else setItemsPerSlide(4);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const items = useMemo(() => galleryItems || [], [galleryItems]);

  // Modal state shared with banner (same as grid modal behavior)
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  const renderItem = (item) => {
    // Resolve image from item.image or first of item.images
    let imageUrl = null;
    if (item?.image) imageUrl = getImageUrlFromObject(item.image);
    else if (Array.isArray(item?.images) && item.images.length > 0)
      imageUrl = getImageUrlFromObject(item.images[0]);

    const title = formatMultilingualContent(item?.title, i18n.language) || "";
    const slug = useSlug(`${title}-${item._id}`);

    const onClick = () => openModal(item);

    return (
      <div
        onClick={onClick}
        style={{
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          background: "#fff",
          cursor: "pointer",
          height: 220,
          position: "relative",
        }}
      >
        <img
          src={imageUrl || getPlaceholderImage(480, 220)}
          alt={title || "Gallery"}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = getPlaceholderImage(480, 220);
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          marginLeft: "50%",
          transform: "translateX(-50%)",
          padding: "20px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 120,
          }}
        >
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !items || items.length === 0) return null;

  return (
    <div
      style={{
        width: "100%",
        margin: 0,
        transform: "none",
        padding: "20px 0",
        overflow: "hidden",
      }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Swiper
        key={`${i18n.language}-gallery-banner`}
        modules={[Autoplay, Pagination, Navigation, Keyboard]}
        spaceBetween={12}
        slidesPerView={4}
        loop={true}
        speed={600}
        keyboard={{ enabled: true }}
        dir={isRTL ? "rtl" : "ltr"}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          0: { slidesPerView: 1 },
          576: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          992: { slidesPerView: 4 },
        }}
        {...(isRTL && { rtl: true })}
      >
        {items.map((item, idx) => (
          <SwiperSlide key={item._id || idx}>{renderItem(item)}</SwiperSlide>
        ))}
      </Swiper>
      <GalleryModal
        isOpen={modalOpen}
        onClose={closeModal}
        galleryItem={selectedItem}
      />
    </div>
  );
};

export default GalleryBannerCarousel;
