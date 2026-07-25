/**
 * @file features/reports/pages/EditReportPage.tsx
 * @description Página de edición completa de un reporte de mascota existente.
 * Permite cambiar el estado (Activo, Resuelto, Borrador, etc.), tipo de reporte,
 * información de la mascota, ubicación, contacto e imágenes (añadir y borrar).
 */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import apiClient from "@/services/api";
import { ReportType, ReportStatus } from "@/types";
import {
  formatSpecies,
  formatSex,
  formatSize,
  formatImageUrl,
} from "@/utils/formatters";
import { CHILE_REGIONS } from "@/features/reports/data/chile-locations";

const EditReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Estados del Formulario
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusWarningModal, setShowStatusWarningModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Campos editables
  const [type, setType] = useState<ReportType>(ReportType.LOST);
  const [initialStatus, setInitialStatus] = useState<ReportStatus>(ReportStatus.PENDING_REVIEW);
  const [status, setStatus] = useState<ReportStatus>(ReportStatus.PENDING_REVIEW);
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState("Perro");
  const [breed, setBreed] = useState("");
  const [color, setColor] = useState("");
  const [sex, setSex] = useState("Macho");
  const [size, setSize] = useState("Mediano");
  const [distinctFeatures, setDistinctFeatures] = useState("");
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // Galería de imágenes: URLs existentes o Base64 nuevas
  const [images, setImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  // Cargar datos iniciales del reporte
  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return;
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const res = await apiClient.get(`/reports/${id}`);
        if (res.data && res.data.success && res.data.data) {
          const rep = res.data.data;
          setType(rep.type || ReportType.LOST);
          setInitialStatus(rep.status || ReportStatus.PENDING_REVIEW);
          setStatus(rep.status || ReportStatus.PENDING_REVIEW);

          const animal = rep.animalInfo || {};
          setPetName(animal.name || rep.petName || "");
          setSpecies(formatSpecies(animal.species || rep.species || "Perro"));
          setBreed(animal.breed || rep.breed || "");
          setColor(animal.color || rep.color || "");
          setSex(formatSex(animal.sex || rep.sex || "Macho"));
          setSize(formatSize(animal.size || rep.size || "Mediano"));
          setDistinctFeatures(
            animal.distinctFeatures ||
              rep.distinctFeatures ||
              rep.additionalInfo ||
              "",
          );

          const loc = rep.location || {};
          const rawRegion = typeof loc === "object" ? loc.region || "" : "";
          const matchedRegion = CHILE_REGIONS.find(
            (r) =>
              r.value === rawRegion ||
              r.label === rawRegion ||
              (rawRegion &&
                (rawRegion.toLowerCase().includes(r.value.toLowerCase()) ||
                  r.label.toLowerCase().includes(rawRegion.toLowerCase()))),
          );
          setRegion(matchedRegion ? matchedRegion.value : rawRegion);
          setComuna(typeof loc === "object" ? loc.comuna || "" : "");
          setAddress(
            typeof loc === "object" ? loc.address || "" : String(loc || ""),
          );

          const cnt = rep.contact || {};
          setPhone(cnt.phone || rep.phone || user?.phone || "");

          if (Array.isArray(rep.images) && rep.images.length > 0) {
            setImages(rep.images.map((img: string) => formatImageUrl(img)));
          } else if (rep.image) {
            setImages([formatImageUrl(rep.image)]);
          }
        }
      } catch (err: any) {
        console.error("Error al cargar reporte para editar:", err);
        setErrorMessage("No se pudo cargar la información del reporte.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [id, user]);

  // Selección de comunas dinámicas según región elegida
  const selectedRegionData = CHILE_REGIONS.find(
    (r) =>
      r.value === region ||
      r.label === region ||
      (region &&
        (r.label.toLowerCase().includes(region.toLowerCase()) ||
          region.toLowerCase().includes(r.value.toLowerCase()))),
  );

  // Procesar archivo de imagen nuevo
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      setImageError("Puedes incluir un máximo de 5 fotos por reporte.");
      return;
    }

    setImageError(null);

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setImageError("Cada foto debe pesar máximo 5 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Guardar Cambios
  const performSave = async (overrideStatus?: ReportStatus) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const finalStatus =
      overrideStatus ||
      (user?.role !== "ADMIN" && initialStatus === ReportStatus.ACTIVE
        ? ReportStatus.PENDING_REVIEW
        : status);

    try {
      const payload = {
        type,
        status: finalStatus,
        animalName: petName.trim(),
        species,
        breed: breed.trim() || "Mestizo",
        color: color.trim() || "No especificado",
        sex,
        size,
        characteristics: distinctFeatures.trim(),
        region: selectedRegionData?.label || region,
        comuna,
        address: address.trim(),
        phone: phone.trim(),
        imagePreviews: images,
      };

      const res = await apiClient.put(`/reports/${id}`, payload);

      if (res.data && res.data.success) {
        setSuccessMessage("¡Reporte actualizado exitosamente!");
        setTimeout(() => {
          navigate(`/reportes/${id}`);
        }, 1200);
      } else {
        setErrorMessage(
          res.data?.message || "No se pudo actualizar el reporte.",
        );
      }
    } catch (err: any) {
      console.error("Error al actualizar reporte:", err);
      setErrorMessage(
        err.response?.data?.message ||
          "Ocurrió un error al intentar actualizar el reporte.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (images.length === 0) {
      setImageError("Debes mantener al menos una foto de la mascota.");
      return;
    }

    if (!region || !comuna || !address.trim()) {
      setErrorMessage("Por favor completa la región, comuna y dirección.");
      return;
    }

    if (!phone.trim()) {
      setErrorMessage("Por favor ingresa un teléfono de contacto.");
      return;
    }

    // Regla 5: Si el usuario (no admin) edita un reporte que está en estado activo, se debe advertir que volverá a revisión
    if (user?.role !== "ADMIN" && initialStatus === ReportStatus.ACTIVE) {
      setShowStatusWarningModal(true);
      return;
    }

    performSave();
  };

  // Eliminar Reporte
  const handleDeleteReport = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      const res = await apiClient.delete(`/reports/${id}`);
      if (res.data && res.data.success) {
        navigate("/perfil");
      } else {
        setErrorMessage(res.data?.message || "No se pudo eliminar el reporte.");
        setShowDeleteModal(false);
      }
    } catch (err: any) {
      console.error("Error al eliminar reporte:", err);
      setErrorMessage(
        err.response?.data?.message || "Error al eliminar el reporte.",
      );
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-thistle-900 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-thistle-200 font-medium mb-4">
          Debes iniciar sesión para editar un reporte.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400 text-white font-bold text-sm shadow-md"
        >
          Ir a Iniciar Sesión
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-thistle-900 flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 border-4 border-baby_pink-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-thistle-200 font-medium text-sm">
          Cargando reporte para edición...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-thistle-900 via-thistle-900 to-icy_blue-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Superior y Botón Volver */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-thistle-300 hover:text-white transition-colors cursor-pointer py-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver sin guardar
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 rounded-xl border border-red-500/60 text-red-300 hover:bg-red-950/40 hover:border-red-400 font-semibold text-xs transition-colors cursor-pointer min-h-[44px] flex items-center gap-1.5"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Eliminar reporte
          </button>
        </div>

        {/* Tarjeta Principal de Edición */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-thistle-700/60 space-y-6">
          <div className="border-b border-thistle-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-baby_pink-400">
              Modo Edición
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-thistle-100 mt-1">
              Editar Reporte de Mascota
            </h1>
            <p className="text-xs text-thistle-300 font-medium mt-1">
              Actualiza la información, cambia el estado de la publicación o
              administra las imágenes asociadas.
            </p>
          </div>

          {/* Banner de Mensajes */}
          {successMessage && (
            <div className="bg-emerald-950/80 border border-emerald-500 rounded-2xl p-4 flex items-center gap-3 text-emerald-200 text-sm font-bold">
              <span>✓</span> {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="bg-pastel_petal-900 border border-pastel_petal-300 rounded-2xl p-4 flex items-center gap-3 text-pastel_petal-100 text-sm font-bold">
              <span>⚠️</span> {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Estado y Tipo de Reporte */}
            <div className="space-y-4 bg-thistle-950/40 p-5 rounded-2xl border border-thistle-800">
              <h3 className="text-sm font-bold text-thistle-200 uppercase tracking-wider">
                1. Estado y Categoría del Reporte
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Selector de Estado */}
                <div>
                  <label className="block text-xs font-bold text-thistle-300 mb-1.5 uppercase">
                    Estado de la publicación
                  </label>
                  {user?.role === "ADMIN" ? (
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ReportStatus)}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 outline-none focus:border-baby_pink-400 text-sm font-semibold cursor-pointer"
                    >
                      <option value={ReportStatus.ACTIVE}>
                        🟢 Publicado / Activo
                      </option>
                      <option value={ReportStatus.PENDING_REVIEW}>
                        ⏳ En Revisión
                      </option>
                      <option value={ReportStatus.REJECTED}>
                        🔴 Rechazado
                      </option>
                      <option value={ReportStatus.DESISTED}>
                        ⚪ Desistido
                      </option>
                      <option value={ReportStatus.RESOLVED}>
                        🎉 Resuelto
                      </option>
                      <option value={ReportStatus.DRAFT}>📝 Borrador</option>
                    </select>
                  ) : initialStatus === ReportStatus.PENDING_REVIEW ? (
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as ReportStatus)}
                      className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 outline-none focus:border-baby_pink-400 text-sm font-semibold cursor-pointer"
                    >
                      <option value={ReportStatus.PENDING_REVIEW}>
                        ⏳ En Revisión
                      </option>
                      <option value={ReportStatus.DESISTED}>
                        ⚪ Desistido (Cancelar publicación)
                      </option>
                    </select>
                  ) : (
                    <div className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl border-2 border-thistle-600 bg-thistle-950/60 text-thistle-200 text-sm font-semibold flex items-center justify-between">
                      <span>
                        {status === ReportStatus.ACTIVE
                          ? "🟢 Activo"
                          : status === ReportStatus.DESISTED
                          ? "⚪ Desistido"
                          : status === ReportStatus.REJECTED
                          ? "🔴 Rechazado"
                          : status === ReportStatus.RESOLVED
                          ? "🎉 Resuelto"
                          : "⏳ En Revisión"}
                      </span>
                      {initialStatus === ReportStatus.ACTIVE && (
                        <span className="text-xs text-amber-400 font-medium">
                          (Pasará a revisión al guardar)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Selector de Tipo */}
                <div>
                  <label className="block text-xs font-bold text-thistle-300 mb-1.5 uppercase">
                    Tipo de reporte
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ReportType)}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 outline-none focus:border-baby_pink-400 text-sm font-semibold cursor-pointer"
                  >
                    <option value={ReportType.LOST}>
                      🔍 Mascota Desaparecida / Perdida
                    </option>
                    <option value={ReportType.FOUND}>
                      🏠 Mascota Encontrada
                    </option>
                    <option value={ReportType.ADOPTION}>💜 En Adopción</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Galería de Fotos (Añadir / Borrar) */}
            <div className="space-y-4 bg-thistle-950/40 p-5 rounded-2xl border border-thistle-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-thistle-200 uppercase tracking-wider">
                    2. Fotos de la Mascota
                  </h3>
                  <p className="text-xs text-thistle-400">
                    Al eliminar una foto y guardar, esta se borrará físicamente
                    del almacenamiento.
                  </p>
                </div>
                <span className="text-xs font-bold text-baby_pink-400">
                  {images.length} / 5 fotos
                </span>
              </div>

              {/* Grid de imágenes previas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-thistle-700 bg-thistle-900 shadow-md"
                  >
                    <img
                      src={imgUrl}
                      alt={`Foto ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white text-xs font-bold cursor-pointer"
                    >
                      <span className="text-base mb-1">🗑️</span>
                      Quitar foto
                    </button>
                  </div>
                ))}

                {/* Botón agregar nueva foto */}
                {images.length < 5 && (
                  <label
                    htmlFor="edit-photo-upload"
                    className="aspect-square rounded-2xl border-2 border-dashed border-thistle-600 bg-thistle-900 hover:border-baby_pink-400 hover:bg-thistle-800 transition-all duration-200 flex flex-col items-center justify-center cursor-pointer text-center p-3 group"
                  >
                    <svg
                      className="w-8 h-8 text-thistle-400 group-hover:text-baby_pink-400 transition-colors mb-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="text-xs font-bold text-thistle-300 group-hover:text-baby_pink-400">
                      Agregar Foto
                    </span>
                  </label>
                )}
              </div>

              <input
                id="edit-photo-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />

              {imageError && (
                <p className="text-xs text-pastel_petal-200 font-semibold">
                  {imageError}
                </p>
              )}
            </div>

            {/* 3. Datos de la Mascota */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-thistle-200 uppercase tracking-wider border-b border-thistle-800 pb-2">
                3. Información de la Mascota
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block text-xs font-bold text-thistle-200 mb-1.5 uppercase">
                    Nombre o Apodo de la Mascota
                  </label>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Ej: Max"
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 placeholder-thistle-400 outline-none transition-all focus:border-baby_pink-400 text-sm"
                  />
                </div>

                {/* Especie */}
                <div>
                  <label className="block text-xs font-bold text-thistle-200 mb-1.5 uppercase">
                    Especie <span className="text-baby_pink-400">*</span>
                  </label>
                  <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 outline-none focus:border-baby_pink-400 text-sm cursor-pointer"
                  >
                    <option value="Perro">🐶 Perro</option>
                    <option value="Gato">🐱 Gato</option>
                    <option value="Ave">🦜 Ave</option>
                    <option value="Conejo">🐰 Conejo</option>
                    <option value="Otro">🐾 Otro Animal</option>
                  </select>
                </div>

                {/* Raza */}
                <div>
                  <label className="block text-xs font-bold text-thistle-200 mb-1.5 uppercase">
                    Raza
                  </label>
                  <input
                    type="text"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    placeholder="Ej: Golden Retriever, Mestizo..."
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 placeholder-thistle-400 outline-none transition-all focus:border-baby_pink-400 text-sm"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-xs font-bold text-thistle-200 mb-1.5 uppercase">
                    Color Dominante
                  </label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Ej: Dorado, Negro con blanco..."
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 placeholder-thistle-400 outline-none transition-all focus:border-baby_pink-400 text-sm"
                  />
                </div>

                {/* Sexo */}
                <div>
                  <label className="block text-xs font-bold text-thistle-200 mb-1.5 uppercase">
                    Sexo
                  </label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 outline-none focus:border-baby_pink-400 text-sm cursor-pointer"
                  >
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                    <option value="Desconocido">Desconocido</option>
                  </select>
                </div>

                {/* Tamaño */}
                <div>
                  <label className="block text-xs font-bold text-thistle-200 mb-1.5 uppercase">
                    Tamaño
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 outline-none focus:border-baby_pink-400 text-sm cursor-pointer"
                  >
                    <option value="Pequeño">Pequeño</option>
                    <option value="Mediano">Mediano</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>
              </div>

              {/* Características Distintivas */}
              <div>
                <label className="block text-xs font-bold text-thistle-200 mb-1.5 uppercase">
                  Características Distintivas y Detalles
                </label>
                <textarea
                  rows={3}
                  value={distinctFeatures}
                  onChange={(e) => setDistinctFeatures(e.target.value)}
                  placeholder="Detalla si llevaba collar, cicatrices, comportamiento, hábitos..."
                  className="w-full px-4 py-3 rounded-2xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 placeholder-thistle-400 outline-none transition-all focus:border-baby_pink-400 text-sm resize-none"
                />
              </div>
            </div>

            {/* 4. Ubicación y Contacto */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-thistle-200 uppercase tracking-wider border-b border-thistle-800 pb-2">
                4. Ubicación y Datos de Contacto
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Región */}
                <div>
                  <label className="block text-xs font-bold text-thistle-200 mb-1.5 uppercase">
                    Región <span className="text-baby_pink-400">*</span>
                  </label>
                  <select
                    required
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      setComuna("");
                    }}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 outline-none focus:border-baby_pink-400 text-sm cursor-pointer"
                  >
                    <option value="">-- Selecciona Región --</option>
                    {CHILE_REGIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Comuna */}
                <div>
                  <label className="block text-xs font-bold text-thistle-200 mb-1.5 uppercase">
                    Comuna <span className="text-baby_pink-400">*</span>
                  </label>
                  <select
                    required
                    disabled={!selectedRegionData}
                    value={comuna}
                    onChange={(e) => setComuna(e.target.value)}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 outline-none focus:border-baby_pink-400 text-sm cursor-pointer disabled:opacity-50"
                  >
                    <option value="">-- Selecciona Comuna --</option>
                    {selectedRegionData?.comunas?.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dirección / Sector */}
                <div>
                  <label className="block text-xs font-bold text-thistle-200 mb-1.5 uppercase">
                    Dirección Exacta o Referencia{" "}
                    <span className="text-baby_pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej: Av. Eliodoro Yáñez 1234, cerca de la plaza"
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 placeholder-thistle-400 outline-none transition-all focus:border-baby_pink-400 text-sm"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-xs font-bold text-thistle-200 mb-1.5 uppercase">
                    Teléfono de Contacto (WhatsApp){" "}
                    <span className="text-baby_pink-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: +56912345678"
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl border-2 border-thistle-600 bg-thistle-900 text-thistle-100 placeholder-thistle-400 outline-none transition-all focus:border-baby_pink-400 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Botones de Acción Formulario */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-thistle-800">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl border-2 border-thistle-600 text-thistle-300 font-semibold text-sm hover:bg-thistle-800 transition-all cursor-pointer min-h-[44px]"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-baby_pink-400 to-pastel_petal-400 text-white font-bold text-sm shadow-md hover:shadow-lg hover:from-baby_pink-300 hover:to-pastel_petal-300 transition-all cursor-pointer min-h-[44px] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── MODAL DE ADVERTENCIA AL EDITAR REPORTE ACTIVO ── */}
      {showStatusWarningModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-thistle-900 border border-thistle-600 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-fade-in text-thistle-100">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-2xl mx-auto">
              ⚠️
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-white">
                El reporte volverá a revisión
              </h3>
              <p className="text-xs text-thistle-200 font-medium leading-relaxed">
                Este reporte se encuentra actualmente en estado{" "}
                <strong className="text-emerald-400 font-bold">Activo</strong>. Al guardar los cambios, pasará automáticamente a estado{" "}
                <strong className="text-sky_blue-300 font-bold">En revisión</strong> para ser validado por un administrador antes de volver a publicarse.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowStatusWarningModal(false)}
                className="w-full py-3 rounded-2xl border-2 border-thistle-600 text-thistle-200 font-bold text-xs hover:bg-thistle-800 transition-all cursor-pointer min-h-[44px]"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowStatusWarningModal(false);
                  performSave(ReportStatus.PENDING_REVIEW);
                }}
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Entendido, guardar cambios"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DE CONFIRMACIÓN DE ELIMINACIÓN ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-thistle-700/60 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-red-950/80 text-red-300 border border-red-500/50 flex items-center justify-center text-2xl mx-auto">
              ⚠️
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-thistle-100">
                ¿Eliminar este reporte?
              </h3>
              <p className="text-xs text-thistle-300 font-medium leading-relaxed">
                Esta acción no se puede deshacer. Se eliminarán el reporte y
                todas sus fotos guardadas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="w-full py-3 rounded-2xl border-2 border-thistle-600 text-thistle-200 font-bold text-xs hover:bg-thistle-800 transition-all cursor-pointer min-h-[44px]"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleDeleteReport}
                disabled={isDeleting}
                className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  "Sí, eliminar reporte"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditReportPage;
