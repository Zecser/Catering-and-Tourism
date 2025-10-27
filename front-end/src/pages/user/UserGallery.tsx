import UserGallery from "../../features/gallery/components/UserGallery"


export default function UserGalleryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
     
      <main className="p-6">
        <UserGallery filter="food" imagesPerPage={5} />

        <UserGallery filter="tourism" imagesPerPage={5} />
      </main>
    </div>
  );
}
