import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  EMPTY_RESUME_DATA,
  resumeTemplates,
  themeColorPalette,
} from "../../utils/data";
import { LuCircleCheckBig } from "react-icons/lu";
import Tabs from "../../../components/Tabs";
import TemplateCard from "../../../components/Cards/TemplateCard";
import RenderResume from "../../../components/ResumeTemplates/RenderResume";

// Create an array from the color palettes
const colorPalettesArray = Object.entries(themeColorPalette).map(
  ([name, colors]) => ({
    name,
    colors,
  })
);

const TAB_DATA = [{ label: "Templates" }, { label: "Color Palettes" }];

const ThemeSelector = ({
  selectedTheme,
  setSelectedTheme,
  resumeData,
  onClose,
}) => {
  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);
  const [tabValue, setTabValue] = useState("Templates");
  const [selectedColorPalette, setSelectedColorPalette] = useState({
    colors: selectedTheme?.colorPalette,
    index: selectedTheme?.theme,
  });

  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    if (selectedTheme?.theme) {
      const index = resumeTemplates.findIndex(
        (template) => template.theme === selectedTheme.theme
      );
      return { theme: selectedTheme.theme, index };
    }

    // Default to first template (TemplateOne)
    return { theme: resumeTemplates[0].theme, index: 0 };
  });

  const handleThemeSelection = () => {
    setSelectedTheme({
      colorPalette: selectedColorPalette?.colors,
      theme: selectedTemplate?.theme,
    });
    onClose();
  };

  const updateBaseWidth = useCallback(() => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener("resize", updateBaseWidth);
    return () => {
      window.removeEventListener("resize", updateBaseWidth);
    };
  }, [updateBaseWidth]);

  return (
    <div className="container mx-auto px-2 md:px-0">
      <div className="flex items-center justify-between mb-5 mt-2">
        <Tabs tabs={TAB_DATA} activeTab={tabValue} setActiveTab={setTabValue} />
        <button
          className="btn-small-light"
          onClick={handleThemeSelection}
          aria-label="Save Theme Selection"
        >
          <LuCircleCheckBig className="text-[16px]" />
          Done
        </button>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Left Column: Templates or Color Palettes */}
        <div className="col-span-12 md:col-span-5 bg-white">
          <div className="grid grid-cols-2 gap-5 max-h-[80vh] overflow-scroll custom-scrollbar md:pr-5">
            {tabValue === "Templates" &&
              resumeTemplates.map((template, index) => (
                <TemplateCard
                  key={`templates_${index}`}
                  thumbnailImg={template.thumbnailImg}
                  isSelected={selectedTemplate?.index === index}
                  onSelect={() =>
                    setSelectedTemplate({ theme: template.theme, index })
                  }
                />
              ))}

            {tabValue === "Color Palettes" &&
              colorPalettesArray.map(({ name, colors }, index) => (
                <ColorPalette
                  key={`palette_${index}`}
                  name={name} // 👈 Pass name
                  colors={colors}
                  isSelected={selectedColorPalette?.index === index}
                  onSelect={() => setSelectedColorPalette({ colors, index })}
                />
              ))}
          </div>
        </div>

        {/* Right Column: Resume Preview */}
        <div
          className="col-span-12 md:col-span-7 bg-white -mt-3 border border-gray-200 rounded-xl shadow-sm"
          ref={resumeRef}
        >
          <RenderResume
            templateId={selectedTemplate?.theme || ""}
            resumeData={resumeData || EMPTY_RESUME_DATA}
            containerWidth={baseWidth}
            colorPalette={selectedColorPalette?.colors || []}
          />
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;

// ColorPalette Component
const ColorPalette = ({ name, colors, isSelected, onSelect }) => {
  return (
    <div
      className={`rounded-lg overflow-hidden border-2 cursor-pointer ${
        isSelected ? "border-purple-500" : "border-gray-200"
      }`}
      onClick={onSelect}
    >
      <div className="flex h-20">
        {colors.map((color, index) => {
          return (
            <div
              key={`color_${index}`}
              className="flex-1"
              style={{ backgroundColor: color }}
            />
          );
        })}
      </div>
      <p className="text-center text-xs font-medium py-1 text-gray-700">
        {name}
      </p>
    </div>
  );
};
