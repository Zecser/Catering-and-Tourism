import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import type { PlanPricingType } from "../type";

const formatMoney = (amount: number, locale = "en-IN", currency = "INR") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};

type Props = PlanPricingType & {
  onEdit?: () => void;
  onDelete?: () => void;
  onBuy?: () => void;
};

const PricingCard = ({
  description,
  features,
  price,
  title,
  onEdit,
  onDelete,
  onBuy,
}: Props) => {

  return (
    <Card className="bg-gradient-to-tl to-[#992183] from-[#601B53] p-5 rounded-xl space-y-4 gap-0 text-white flex flex-col h-full border border-white/30 shadow-white/10">
      <p className="text-center text-lg sm:text-xl font-medium">{title}</p>
      <p className="text-sm font-light italic">{description}</p>
      <p className="text-center text-xl lg:text-2xl font-bold line-clamp-1">
        {formatMoney(Number(price))}
      </p>
      <ul className="list-disc text-start list-inside font-light text-sm space-y-3 flex-grow">
        {features?.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <Button
        onClick={onEdit ?? onBuy}
        className={`w-full bg-transparent border border-white self-end ${
          onEdit
            ? "bg-white text-primary hover:text-pretty hover:bg-white/80"
            : ""
        }`}
      >
        {onEdit ? "EDIT" : "BOOK NOW"}
      </Button>
      {onDelete && (
        <Button
          variant="destructive"
          onClick={onDelete}
          className={`w-full self-end`}
        >
          DELETE
        </Button>
      )}
    </Card>
  );
};

export default PricingCard;
