"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

let QRCodeStyling: any;
if (typeof window !== "undefined") {
  QRCodeStyling = require("qr-code-styling");
}

export type GradientConfig = {
  direction: "horizontal" | "vertical" | "diagonal";
  colors: string[];
  blend?: boolean;
};

export interface QRStyledProps {
  value: string;
  size?: number;
  dotStyle?: "square" | "rounded" | "dots" | "classy" | "classy-rounded" | "extra-rounded";
  fgColor?: string;
  bgColor?: string;
  logo?: string;
  logoSize?: number;
  cornerStyle?: "square" | "dot" | "extra-rounded";
  cornerColor?: string;
  gradientConfig?: GradientConfig;
  frameStyle?: "none" | "scanme" | "brackets";
  onGenerated?: (dataUrl: string) => void;
}

export interface QRStyledRef {
  downloadQR: (format: "png" | "svg" | "jpeg", size?: number) => void;
  getDataURL: () => Promise<string>;
}

export const QRStyled = forwardRef<QRStyledRef, QRStyledProps>(
  (
    {
      value,
      size = 300,
      dotStyle = "square",
      fgColor = "#0C0F14",
      bgColor = "#ffffff",
      logo,
      logoSize = 0.2,
      cornerStyle = "square",
      cornerColor,
      gradientConfig,
      frameStyle = "none",
      onGenerated,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const qrCodeRef = useRef<any>(null);

    const getOptions = (currentSize: number) => {
      const options: any = {
        width: currentSize,
        height: currentSize,
        data: value,
        dotsOptions: {
          color: fgColor,
          type: dotStyle,
        },
        backgroundOptions: {
          color: bgColor,
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 5,
          imageSize: logoSize,
          hideBackgroundDots: true,
        },
        qrOptions: {
          typeNumber: 0,
          mode: "Byte",
          errorCorrectionLevel: "H",
        },
        cornersSquareOptions: {
          type: cornerStyle,
          color: cornerColor || fgColor,
        },
        cornersDotOptions: {
          type: cornerStyle === "extra-rounded" ? "dot" : "square",
          color: cornerColor || fgColor,
        },
      };

      if (logo) {
        options.image = logo;
      }

      if (gradientConfig && gradientConfig.colors.length > 0) {
        const { direction, colors, blend = true } = gradientConfig;
        const rotation =
          direction === "horizontal"
            ? 0
            : direction === "vertical"
            ? Math.PI / 2
            : Math.PI / 4;

        let colorStops: { offset: number; color: string }[] = [];
        if (blend || colors.length === 1) {
          colorStops = colors.map((color, i) => ({
            offset: colors.length > 1 ? i / (colors.length - 1) : 0,
            color,
          }));
        } else {
          // Sharp stripes (flag style)
          const step = 1 / colors.length;
          colors.forEach((color, i) => {
            colorStops.push({ offset: i * step, color });
            colorStops.push({ offset: (i + 1) * step, color });
          });
        }

        options.dotsOptions.gradient = {
          type: "linear",
          rotation,
          colorStops,
        };

        options.cornersSquareOptions.gradient = {
          type: "linear",
          rotation,
          colorStops: [
            { offset: 0, color: colors[0] },
            { offset: 1, color: colors[colors.length - 1] },
          ],
        };

        options.cornersDotOptions.gradient = {
          type: "linear",
          rotation,
          colorStops: [
            { offset: 0, color: colors[0] },
            { offset: 1, color: colors[colors.length - 1] },
          ],
        };
      }

      return options;
    };

    useImperativeHandle(ref, () => ({
      downloadQR: (format: "png" | "svg" | "jpeg", sizeForDownload?: number) => {
        if (!QRCodeStyling) return;
        
        if (sizeForDownload && sizeForDownload !== size) {
          const downloadInstance = new QRCodeStyling(getOptions(sizeForDownload));
          downloadInstance.download({ name: "qrcode", extension: format });
        } else {
          if (qrCodeRef.current) {
            qrCodeRef.current.download({ name: "qrcode", extension: format });
          }
        }
      },
      getDataURL: async (): Promise<string> => {
        if (!qrCodeRef.current) return "";
        const blob = await qrCodeRef.current.getRawData("png");
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            if (onGenerated) onGenerated(result);
            resolve(result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      },
    }));

    useEffect(() => {
      if (typeof window !== "undefined" && QRCodeStyling && containerRef.current && !qrCodeRef.current) {
        qrCodeRef.current = new QRCodeStyling(getOptions(size));
        qrCodeRef.current.append(containerRef.current);
      }
      
      // Cleanup on unmount
      return () => {
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
        qrCodeRef.current = null;
      };
    }, []);

    useEffect(() => {
      if (qrCodeRef.current) {
        qrCodeRef.current.update(getOptions(size));
      }
    }, [
      value,
      size,
      dotStyle,
      fgColor,
      bgColor,
      logo,
      logoSize,
      cornerStyle,
      cornerColor,
      gradientConfig,
    ]);

    return (
      <div className="relative inline-flex items-center justify-center">
        <div
          className={`
            ${
              frameStyle === "scanme"
                ? "p-4 border-[2px] border-[#00DDB4] rounded-[16px] bg-white text-center flex flex-col items-center"
                : ""
            }
            ${frameStyle === "brackets" ? "p-6 relative inline-block" : ""}
          `}
        >
          {frameStyle === "brackets" && (
            <>
              {/* Top Left */}
              <div className="absolute top-0 left-0 w-[20px] h-[3px] bg-[#00DDB4]" />
              <div className="absolute top-0 left-0 w-[3px] h-[20px] bg-[#00DDB4]" />
              {/* Top Right */}
              <div className="absolute top-0 right-0 w-[20px] h-[3px] bg-[#00DDB4]" />
              <div className="absolute top-0 right-0 w-[3px] h-[20px] bg-[#00DDB4]" />
              {/* Bottom Left */}
              <div className="absolute bottom-0 left-0 w-[20px] h-[3px] bg-[#00DDB4]" />
              <div className="absolute bottom-0 left-0 w-[3px] h-[20px] bg-[#00DDB4]" />
              {/* Bottom Right */}
              <div className="absolute bottom-0 right-0 w-[20px] h-[3px] bg-[#00DDB4]" />
              <div className="absolute bottom-0 right-0 w-[3px] h-[20px] bg-[#00DDB4]" />
            </>
          )}

          <div ref={containerRef} />

          {frameStyle === "scanme" && (
            <p
              className="mt-2 text-[#00DDB4] font-bold tracking-[3px] text-[13px] uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              Scan me
            </p>
          )}
        </div>
      </div>
    );
  }
);

QRStyled.displayName = "QRStyled";

// Preset components
export const ClassicQR = ({ value, size = 300 }: { value: string; size?: number }) => (
  <QRStyled
    value={value}
    size={size}
    dotStyle="square"
    fgColor="#000000"
    bgColor="#ffffff"
    cornerStyle="square"
  />
);

export const RoundedQR = ({ value, size = 300 }: { value: string; size?: number }) => (
  <QRStyled
    value={value}
    size={size}
    dotStyle="extra-rounded"
    fgColor="#0C0F14"
    bgColor="#ffffff"
    cornerStyle="extra-rounded"
  />
);

export const ColoredQR = ({
  value,
  size = 300,
  logo,
}: {
  value: string;
  size?: number;
  logo?: string;
}) => (
  <QRStyled
    value={value}
    size={size}
    dotStyle="dots"
    fgColor="#00DDB4"
    bgColor="#0C0F14"
    cornerStyle="dot"
    cornerColor="#00DDB4"
    logo={logo}
  />
);

export const BrandedQR = ({ value, size = 300 }: { value: string; size?: number }) => (
  <QRStyled
    value={value}
    size={size}
    dotStyle="classy-rounded"
    fgColor="#0C0F14"
    bgColor="#ffffff"
    logo="/logo.png"
    logoSize={0.25}
    cornerStyle="extra-rounded"
    cornerColor="#00DDB4"
  />
);
