import { useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useSavedProperties } from "../../contexts/SavedPropertiesContext";

export default function SavePropertyButton({
  propertyId,
  size = 15,
  className = "",
}) {
  const { user } = useAuth();
  const { savedIds, toggle } = useSavedProperties();
  const navigate = useNavigate();
  const [animating, setAnimating] = useState(false);

  const isSaved = savedIds.has(propertyId);

  async function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/login", { state: { message: "Log in to save properties" } });
      return;
    }

    setAnimating(true);
    await toggle(propertyId);
    setTimeout(() => setAnimating(false), 500);
  }

  return (
    <button
      onClick={handleClick}
      className={[
        "p-2 bg-white/80 backdrop-blur-sm rounded-full transition-all duration-200 hover:scale-110",
        isSaved
          ? "text-accent hover:bg-white"
          : "text-gray-400 hover:text-error hover:bg-white",
        animating ? "scale-125" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={isSaved ? "Remove from saved" : "Save property"}>
      <Heart
        size={size}
        className={isSaved ? "fill-accent" : ""}
      />
    </button>
  );
}
