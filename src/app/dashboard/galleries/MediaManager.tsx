'use client';

import { useState } from 'react';
import { Plus, Folder, Image as ImageIcon, Trash2, Edit, MoreVertical, X } from 'lucide-react';
import Image from 'next/image';
import DeleteButton from '@/components/ui/DeleteButton';
import toast from 'react-hot-toast';
import { deleteAlbum, deleteGalleryImage } from '@/actions/gallery';
import UploadImagesModal from './UploadImagesModal';
import AlbumModal from './AlbumModal';
import { formatRelativeDate } from '@/lib/formatDate';

export default function MediaManager({ initialAlbums, initialImages }: { initialAlbums: any[], initialImages: any[] }) {
  const [albums, setAlbums] = useState(initialAlbums);
  const [images, setImages] = useState(initialImages);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  
  const [selectedAlbum, setSelectedAlbum] = useState<any | null>(null);
  const [editingAlbum, setEditingAlbum] = useState<any | null>(null);
  const [expandedAlbums, setExpandedAlbums] = useState<number[]>([]);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const looseImages = images.filter((img: any) => img.album_id === null);

  const toggleAlbum = (id: number) => {
    if (expandedAlbums.includes(id)) {
      setExpandedAlbums(expandedAlbums.filter(a => a !== id));
    } else {
      setExpandedAlbums([...expandedAlbums, id]);
    }
  };

  const handleCreateAlbum = () => {
    setEditingAlbum(null);
    setIsAlbumModalOpen(true);
  };

  const handleEditAlbum = (album: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAlbum(album);
    setIsAlbumModalOpen(true);
  };

  const handleUploadImages = (albumId?: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedAlbum(albumId || null);
    setIsUploadModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Banco de Imágenes</h2>
          <p className="text-foreground/50 mt-1">Gestiona tus álbumes de proyectos y fotos sueltas</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleCreateAlbum()}
            className="bg-card border border-card-border text-foreground px-4 py-2.5 rounded-xl font-bold hover:bg-card-border transition-colors flex items-center gap-2"
          >
            <Folder size={20} />
            <span>Nuevo Álbum</span>
          </button>
          <button 
            onClick={() => handleUploadImages()}
            className="bg-brand-accent text-brand-dark px-4 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_15px_rgba(255,109,36,0.2)]"
          >
            <Plus size={20} />
            <span>Subir Fotos</span>
          </button>
        </div>
      </div>

      {/* ÁLBUMES */}
      <section>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Folder className="text-brand-accent" />
          Álbumes de Proyectos
        </h3>
        {albums.length === 0 ? (
          <p className="text-foreground/50 italic">No hay álbumes creados.</p>
        ) : (
          <div className="space-y-4">
            {albums.map((album: any) => {
              const isExpanded = expandedAlbums.includes(album.album_id);
              return (
                <div key={album.album_id} className="bg-card border border-card-border rounded-xl hover:border-brand-accent/50 transition-colors relative">
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-foreground/5 transition-colors rounded-xl"
                    onClick={() => toggleAlbum(album.album_id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                        <Folder size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{album.name}</h4>
                        <p className="text-sm text-foreground/60">{album.description || 'Sin descripción'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold bg-background px-3 py-1 rounded-full text-foreground/70 border border-card-border whitespace-nowrap hidden sm:inline-block">
                        {album.images?.length || 0} fotos
                      </span>
                      
                      {/* Mobile 3-Dots Button */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === album.album_id ? null : album.album_id); }}
                        className="md:hidden p-2 text-foreground/50 hover:text-brand-accent rounded-lg bg-background border border-card-border"
                      >
                        {openMenuId === album.album_id ? <X size={20} /> : <MoreVertical size={20} />}
                      </button>

                      {/* Desktop Inline Actions / Mobile Dropdown Actions */}
                      <div 
                        className={`
                          absolute right-4 top-16 bg-card border border-card-border p-2 rounded-xl shadow-xl z-10 flex-col gap-2 
                          ${openMenuId === album.album_id ? 'flex animate-fade-in-up' : 'hidden'} 
                          md:static md:bg-transparent md:border-none md:p-0 md:shadow-none md:flex md:flex-row md:items-center md:gap-2
                        `}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button 
                          onClick={(e) => { handleUploadImages(album.album_id, e); setOpenMenuId(null); }}
                          className="flex items-center justify-center text-xs font-bold text-brand-accent hover:bg-brand-accent/10 px-4 py-2 md:px-2 rounded-lg transition-colors whitespace-nowrap border border-brand-accent/20 md:border-transparent"
                        >
                          + Añadir Fotos
                        </button>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => { handleEditAlbum(album, e); setOpenMenuId(null); }} 
                            className="flex-1 p-2 bg-background md:bg-transparent border md:border-none border-card-border flex justify-center text-foreground/50 hover:text-brand-accent rounded-lg transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <div className="flex-1 bg-background md:bg-transparent border md:border-none border-card-border rounded-lg flex justify-center" onClick={() => setOpenMenuId(null)}>
                            <DeleteButton 
                              onDelete={async () => await deleteAlbum(album.album_id)}
                              itemName={album.name}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FOTOS DENTRO DEL ÁLBUM */}
                  {isExpanded && (
                    <div className="p-4 border-t border-card-border bg-background/30 rounded-b-xl">
                      {album.images && album.images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          {album.images.map((img: any) => (
                            <div key={img.image_id} className="group relative aspect-square rounded-xl overflow-hidden border border-card-border bg-background cursor-pointer" onClick={() => setViewingImage(img.image_url)}>
                              <Image 
                                src={img.image_url} 
                                alt={img.description || 'Imagen del álbum'}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                                <p className="text-xs text-white line-clamp-3 mb-2">{img.description}</p>
                                <div onClick={(e) => e.stopPropagation()}>
                                  <DeleteButton 
                                    onDelete={async () => await deleteGalleryImage(img.image_id)}
                                    itemName="esta foto"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-foreground/50 italic mb-2">Este álbum está vacío.</p>
                          <button 
                            onClick={(e) => handleUploadImages(album.album_id, e)}
                            className="text-sm font-bold text-brand-accent hover:underline"
                          >
                            Sube la primera foto aquí
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* FOTOS SUELTAS */}
      <section>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ImageIcon className="text-brand-accent" />
          Fotos Sueltas
        </h3>
        {looseImages.length === 0 ? (
          <p className="text-foreground/50 italic">No hay fotos sueltas.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {looseImages.map((img: any) => (
              <div key={img.image_id} className="group relative aspect-square rounded-xl overflow-hidden border border-card-border bg-background cursor-pointer" onClick={() => setViewingImage(img.image_url)}>
                <Image 
                  src={img.image_url} 
                  alt={img.description || 'Imagen sin descripción'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                  <p className="text-xs text-white line-clamp-3 mb-2">{img.description}</p>
                  <div onClick={(e) => e.stopPropagation()}>
                    <DeleteButton 
                      onDelete={async () => await deleteGalleryImage(img.image_id)}
                      itemName="esta foto"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <UploadImagesModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        albumId={selectedAlbum} 
      />
      <AlbumModal 
        isOpen={isAlbumModalOpen} 
        onClose={() => setIsAlbumModalOpen(false)} 
        album={editingAlbum} 
      />

      {/* LIGHTBOX / VISOR DE IMAGEN A DETALLE */}
      {viewingImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up"
          onClick={() => setViewingImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white bg-black/50 p-2 rounded-full transition-colors"
            onClick={() => setViewingImage(null)}
          >
            <Plus size={32} className="rotate-45" />
          </button>
          <div className="relative w-full max-w-5xl h-[85vh]">
            <Image 
              src={viewingImage} 
              alt="Vista en detalle"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
