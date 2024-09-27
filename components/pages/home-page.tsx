"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { TAILWIND_COLORS } from "@/constants/tailwind-colors";
import Logo from "@/components/icons/logo";
import Link from "next/link.js";
import { cn } from "@/lib/utils";

type RGB = [number, number, number];

interface ColorResult {
  color: string;
  code: string;
}

const hexToRgb = (hex: string): RGB => {
  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return [r, g, b];
};

const parseRgb = (rgb: string): RGB => {
  return rgb.match(/\d+/g)!.map(Number) as RGB;
};

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

const colorDistance = (rgb1: RGB, rgb2: RGB): number => {
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
      Math.pow(rgb1[1] - rgb2[1], 2) +
      Math.pow(rgb1[2] - rgb2[2], 2)
  );
};

const findClosestTailwindColor = (rgb: RGB): ColorResult => {
  let closestColor: string | null = null;
  let closestDistance = Infinity;
  let closestCode = "";

  Object.entries(TAILWIND_COLORS).forEach(([colorName, shades]) => {
    if (typeof shades === "string") {
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
      if (!/^#([0-9A-Fa-f]{3}){1,2}$/.test(input)) {
        setError("Invalid HEX format. Use the format #RGB or #RRGGBB.");
        return;
      }
      rgb = hexToRgb(input);
    } else if (input.startsWith("rgb")) {
      if (!/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(input)) {
        setError("Invalid RGB format. Use the format rgb(R, G, B).");
        return;
      }
      rgb = parseRgb(input);
    } else if (input.startsWith("hsl")) {
      if (!/^hsl\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*\)$/.test(input)) {
        setError("Invalid HSL format. Use the format hsl(H, S%, L%).");
        return;
      }
      const [h, s, l] = parseRgb(input);
      rgb = hslToRgb(h, s, l);
    } else {
      setError("Unrecognized color format. Use HEX, RGB, or HSL.");
      return;
    }

    const closestColor = findClosestTailwindColor(rgb);
    setResult(closestColor);
  };

  return (
    <div className="p-4 max-w-md w-full">
      <div className="w-full flex-col flex items-center justify-center mb-6 gap-2">
        <Logo />
        <h2 className="text-center font-semibold">
          Convert Colors to Tailwind Shades
        </h2>
      </div>
      <div className="w-full flex flex-col items-center justify-center mb-6">
        <p className="text-center">
          Easily find the closest Tailwind CSS color to any hue.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <Input
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          placeholder="Enter a color (HEX, RGB, or HSL)"
          className="w-full"
        />
        <Button type="submit" className="w-full">
          Find the matching color
        </Button>
      </form>
      {error && (
        <Alert variant="destructive" className="mt-4 w-full">
          {error}
        </Alert>
      )}
      {result && (
        <div className="w-full mt-4 p-4 border rounded-2xl">
          <p>Closest Tailwind color:</p>
          <div
            className={cn(
              "w-full h-20 mt-2 mb-2 rounded-xl",
              result.code === "white" ? "border border-gray-300" : ""
            )}
            style={{ backgroundColor: result.color }}
          ></div>
          <p>
            Tailwind code: <strong>{result.code}</strong>
          </p>
          <p>
            HEX value: <strong>{result.color}</strong>
          </p>
        </div>
      )}
      <div className="w-full flex items-center justify-center mt-10">
        <Button variant="outline" asChild>
          <Link
            href="https://github.com/ln-dev7/cotocowind"
            target="_blank"
            rel="noopener noreferrer"
          >
            GITHUB
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
