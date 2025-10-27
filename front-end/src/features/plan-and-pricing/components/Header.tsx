type Props = {
  isAdmin: boolean;
};
const Header = ({ isAdmin }: Props) => {
  if (isAdmin) {
    return <p className="font-bold text-xl md:text-2xl underline mb-5">Manage your plans</p>;
  }
  return (
    <>
      <img src="/g-logo.png" className="mx-auto h-[40px]" />
      <p className="font-bold text-xl md:text-2xl">
        Upgrade Your Travel Moment
      </p>
      <p className="font-light text-sm">Choose The Right Plan For You</p>
    </>
  );
};

export default Header;
