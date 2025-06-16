function ModalProses({ show, proses, tutupModal }) {
  return (
    <div
      className={`modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${
        show ? "show" : "hidden"
      }`}
    >
      <div className="modal-content bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">
          Detail Proses Backward Chaining
        </h3>
        <ul className="list-disc pl-5 text-gray-700">
          {proses.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
        <button
          onClick={tutupModal}
          className="mt-6 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

export default ModalProses;
