export default function AppLogo() {
    return (
        <>
            {/* Hapus bg-sidebar-primary jika gambar logo Anda sudah memiliki warna/background sendiri */}
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md">
                <img 
                    src="/apple-touch-icon.png" 
                    alt="Logo SMP 51 Makassar" 
                    className="h-full w-full object-contain"
                />
            </div>
            
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-bold text-slate-800 dark:text-white">
                    SMP 51 MAKASSAR
                </span>
            </div>
        </>
    );
}