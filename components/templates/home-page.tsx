"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { TAILWIND_COLORS } from "@/constants/tailwind-colors";

type RGB = [number, number, number];

interface ColorResult {
  color: string;
  code: string;
}

// Fonction pour convertir HEX en RGB
const hexToRgb = (hex: string): RGB => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

// Fonction pour parser RGB
const parseRgb = (rgb: string): RGB => {
  return rgb.match(/\d+/g)!.map(Number) as RGB;
};

// Fonction pour convertir HSL en RGB
const hslToRgb = (h: number, s: number, l: number): RGB => {
  h /= 360;
  s /= 100;
  l /= 100;
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

// Fonction pour calculer la distance entre deux couleurs
const colorDistance = (rgb1: RGB, rgb2: RGB): number => {
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
      Math.pow(rgb1[1] - rgb2[1], 2) +
      Math.pow(rgb1[2] - rgb2[2], 2)
  );
};

// Fonction pour trouver la couleur Tailwind la plus proche
const findClosestTailwindColor = (rgb: RGB): ColorResult => {
  let closestColor: string | null = null;
  let closestDistance = Infinity;
  let closestCode = "";

  Object.entries(TAILWIND_COLORS).forEach(([colorName, shades]) => {
    if (typeof shades === "string") {
      // Pour le blanc et le noir qui n'ont pas de nuances
      const tailwindRgb = hexToRgb(shades);
      const distance = colorDistance(rgb, tailwindRgb);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestColor = shades;
        closestCode = colorName;
      }
    } else {
      Object.entries(shades).forEach(([shade, hexColor]) => {
        const tailwindRgb = hexToRgb(hexColor);
        const distance = colorDistance(rgb, tailwindRgb);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestColor = hexColor;
          closestCode =
            shade === "DEFAULT" ? colorName : `${colorName}-${shade}`;
        }
      });
    }
  });

  return { color: closestColor!, code: closestCode };
};

const HomePage: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<ColorResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setResult(null);

    let rgb: RGB;
    if (input.startsWith("#")) {
      // HEX
      if (!/^#[0-9A-Fa-f]{6}$/.test(input)) {
        setError("Format HEX invalide. Utilisez le format #RRGGBB.");
        return;
      }
      rgb = hexToRgb(input);
    } else if (input.startsWith("rgb")) {
      // RGB
      if (!/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(input)) {
        setError("Format RGB invalide. Utilisez le format rgb(R, G, B).");
        return;
      }
      rgb = parseRgb(input);
    } else if (input.startsWith("hsl")) {
      // HSL
      if (!/^hsl\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*\)$/.test(input)) {
        setError("Format HSL invalide. Utilisez le format hsl(H, S%, L%).");
        return;
      }
      const [h, s, l] = parseRgb(input);
      rgb = hslToRgb(h, s, l);
    } else {
      setError("Format de couleur non reconnu. Utilisez HEX, RGB ou HSL.");
      return;
    }

    const closestColor = findClosestTailwindColor(rgb);
    setResult(closestColor);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">CoToCoWind</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          placeholder="Entrez une couleur (HEX, RGB, ou HSL)"
          className="w-full"
        />
        <Button type="submit" className="w-full">
          Trouver la correspondance
        </Button>
      </form>
      {error && (
        <Alert variant="destructive" className="mt-4">
          {error}
        </Alert>
      )}
      {result && (
        <div className="mt-4 p-4 border rounded">
          <p>Couleur Tailwind la plus proche :</p>
          <div
            className="w-full h-20 mt-2 mb-2"
            style={{ backgroundColor: result.color }}
          ></div>
          <p>
            Code Tailwind : <strong>{result.code}</strong>
          </p>
          <p>
            Valeur HEX : <strong>{result.color}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
