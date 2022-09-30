import { BiError } from "react-icons/bi";

type Props = {
  message: string;
  success?: boolean;
};

const CustomToast = (props: Props) => {
  return (
    <div
      className={`px-5 py-3 rounded-full flex items-center gap-2 ${
        props.success ? "bg-black text-green-500" : "bg-red-500 text-white"
      }`}
    >
      <BiError className="text-lg" />
      <p>{props.message}</p>
    </div>
  );
};

export default CustomToast;
