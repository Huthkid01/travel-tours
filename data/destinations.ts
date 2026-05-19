import { images } from "@/lib/images";
import type { Destination } from "@/types";

export const destinations: Destination[] = [
  {
    id: "1",
    name: "Dubai",
    country: "UAE",
    image: images.dubai,
    tours: 12,
    description: "Luxury skyscrapers and golden desert adventures",
  },
  {
    id: "2",
    name: "Istanbul",
    country: "Turkey",
    image: images.turkey,
    tours: 8,
    description: "Where East meets West in timeless splendor",
  },
  {
    id: "3",
    name: "London",
    country: "UK",
    image: images.uk,
    tours: 10,
    description: "Royal heritage and cosmopolitan elegance",
  },
  {
    id: "4",
    name: "Banff",
    country: "Canada",
    image: images.canada,
    tours: 6,
    description: "Majestic mountains and pristine wilderness",
  },
  {
    id: "5",
    name: "Paris",
    country: "France",
    image: images.paris,
    tours: 15,
    description: "The city of light, art, and romance",
  },
  {
    id: "6",
    name: "Maldives",
    country: "Maldives",
    image: images.maldives,
    tours: 5,
    description: "Tropical paradise with crystal waters",
  },
];
