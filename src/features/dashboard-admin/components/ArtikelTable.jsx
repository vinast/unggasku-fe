import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export const ArtikelTable = () => {
  const [artikelList, setArtikelList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/admin/artikel");
        console.log("Fetched Articles:", response.data); 
        if (response.data && Array.isArray(response.data.data)) {
          setArtikelList(response.data.data);
        } else {
          setError("Data artikel tidak valid.");
        }
        setLoading(false);
      } catch (err) {
        console.error("API Error: ", err); // Log error API
        setError("Gagal mengambil data artikel");
        setLoading(false);
      }
    };
  
    fetchArtikel();
  }, []); 

  const handleDelete = async (id) => {
    console.log("Deleting article with ID: ", id);
  
    if (window.confirm("Are you sure you want to delete this article?")) {
      setDeleting(id);
      try {
        const response = await axios.delete(`http://localhost:3000/api/v1/admin/artikel/${id}`);
        console.log("Delete Response: ", response);
  
        if (response.status === 200) {
          console.log("Successfully deleted article:", id);
          setArtikelList((prevList) => prevList.filter((artikel) => artikel._id !== id));
        } else {
          setError("Failed to delete the article");
          console.error("Delete failed with status:", response.status);
        }
      } catch (err) {
        setError("Failed to delete the article");
        console.error("Delete Error: ", err);
      } finally {
        setDeleting(null);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section>
      <div className="relative overflow-x-auto">
        <table className="text-left text-sm text-gray-500 w-full">
          <thead className="bg-gray-50 text-sm uppercase text-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">No</th>
              <th scope="col" className="px-6 py-3">Judul</th>
              <th scope="col" className="px-6 py-3">Images</th>
              <th scope="col" className="px-6 py-3">Konten</th>
              <th scope="col" className="px-6 py-3">Kategori</th>
              <th scope="col" className="px-6 py-3">Tanggal</th>
              <th scope="col" className="px-6 py-3">Role</th>
              <th scope="col" className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
          {artikelList.length > 0 ? (
              artikelList.map((artikel, index) => (
                <tr key={artikel._id || index} className="border-b bg-white">
                  {/* Konten table */}
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap px-6 py-4">
                    {artikel.judul && artikel.judul.length > 20
                      ? `${artikel.judul.substring(0, 25)}...`
                      : artikel.judul || 'No Title'}
                  </td>
                  <td className="px-6 py-4 overflow-hidden">
                    <div className="size-52">
                      <img
                        src={artikel.image_artikel || "https://via.placeholder.com/150"}
                        alt={artikel.judul || 'Image'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="block w-96 px-6 py-4">
                    <p>{artikel.konten && artikel.konten.length > 400 ? `${artikel.konten.substring(0, 425)}...` : artikel.konten || 'No content available'}</p>
                  </td>
                  <td className="px-6 py-4">
                    {artikel.kategori || 'Lingkungan'}
                  </td>
                  <td className="px-6 py-4">
                    {artikel.tanggal ? new Date(artikel.tanggal).toLocaleDateString("id-ID") : 'No date'}
                  </td>
                  <td className="px-6 py-4">
                    {artikel.role || 'Admin / Dokter'}
                  </td>
                  <td className="flex space-x-4 px-6 py-4">
                    <Link
                      to={`/dashboard/admin/artikel/edit/${artikel._id}`}
                      className="text-white p-2 rounded-md bg-primary-400"
                    >
                      Update
                    </Link>
                    <button
                      className="text-white p-2 rounded-md bg-red-500"
                      onClick={() => handleDelete(artikel._id)}
                      disabled={deleting === artikel._id}
                    >
                      {deleting === artikel._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center px-6 py-4">No articles available</td>
              </tr>
            )}
            </tbody>
        </table>
      </div>
    </section>
  );
};