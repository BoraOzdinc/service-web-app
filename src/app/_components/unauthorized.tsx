import UnauthorizedIcon from "./unauthorizedIcon";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <UnauthorizedIcon />
      <div className="flex flex-col items-center justify-center">
        <p className="text-3xl font-semibold">Erişim Engellendi!</p>
        <p>Bu sayfaya erişim için yeterli yetkiye sahip değilsiniz!</p>
      </div>
    </div>
  );
};

export default Unauthorized;
