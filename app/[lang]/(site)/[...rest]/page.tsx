import { notFound } from "next/navigation";

/** Toute adresse sans page correspondante affiche la page 404 traduite du site. */
export default function UnknownPage() {
  notFound();
}
