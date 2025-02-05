import { useState } from "react";
import aktivitetIcon from "../../assets/sport-curling.svg";
import kulturIcon from "../../assets/culture.svg";
import matIcon from "../../assets/food.svg";
import boendeIcon from "../../assets/house.svg";
import designIcon from "../../assets/shopping.svg";
import evenemangIcon from "../../assets/ticket.svg";

interface AttractionListProps {
  setSelectedCategory: (category: string) => void;
}

function AttractionList({ setSelectedCategory }: AttractionListProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const items = [
    { 
      id: 1, 
      label: "Aktiviteter", 
      icon: aktivitetIcon, 
      subItems: [
        "Bada", "Barn & Familj", "Cykla", "Fiska", 
        "Golfa", "Motor", "Nöjesaktiviteter", "Paddla", 
        "På vatten", "Skidåkning", "Sport, Motion & Hälsa", 
        "Vandra", "Övriga vinteraktiviteter"
      ] 
    },
    { 
      id: 2, 
      label: "Evenemang", 
      icon: evenemangIcon, 
      subItems: [
        "Barn", "Dans", "Föreläsning och workshop", 
        "Marknad, mässa, auktion och loppis", "Mat och dryck", 
        "Motor", "Musik", "På vatten", 
        "Sport, motion och hälsa", "Teater och underhållning", 
        "Utställning", "Övriga evenemang"
      ] 
    },
    { 
      id: 3, 
      label: "Kultur & historia", 
      icon: kulturIcon, 
      subItems: [
        "Hembygdsgårdar", "Hus & kulturmiljöer", "Konst", "Kyrka", 
        "Museum", "Natursevärdheter", "Parker & trädgårdar"
      ]
    },
    { 
      id: 4, 
      label: "Design & shopping", 
      icon: designIcon, 
      subItems: [
        "Antikt, loppis & secondhand", "Gårdsbutik", "Hantverk", 
        "Industri & tillverkning", "Köpcentrum", "Loppis", 
        "Secondhand", "Shopping"
      ] 
    },
    { 
      id: 5, 
      label: "Mat & dryck", 
      icon: matIcon, 
      subItems: [
        "Gårdsbutiker", "Kafé & bageri", "Lunch", 
        "Pub/nattklubb", "Restaurang", "Snabbmat", "Utkörning"
      ] 
    },
    { 
      id: 6, 
      label: "Boende", 
      icon: boendeIcon, 
      subItems: [
        "Bed & breakfast", "Camping", "Gästhamnar", 
        "Herrgård", "Hotell & pensionat", "Hus/lägenhet/rum", 
        "Lägerplatser", "Stugor", "Ställplatser", 
        "Unika boenden", "Vandrarhem"
      ] 
    }
  ];

  // Funktion för att hantera öppning/stängning av underkategorier
  const handleItemClick = (id: number, label: string) => {
    setActiveIndex(activeIndex === id ? null : id);
    setSelectedCategory(label);
  };

  return (
    <div className="bg-white border border-slate-300 rounded-lg p-4 w-full">
      <h2 className="text-lg font-semibold text-slate-800">
        Se och göra i Värmland
      </h2>

      <div className="flex flex-col space-y-4 mt-4">
        {items.map((item) => (
          <div key={item.id}>
            <div
              className={`flex items-center gap-3 p-4 rounded-md cursor-pointer transition ${
                activeIndex === item.id ? "bg-blue-100 text-blue-600" : "bg-slate-50 text-slate-700"
              }`}
              onClick={() => handleItemClick(item.id, item.label)}
            >
              <img
                src={item.icon}
                alt={`${item.label} icon`}
                className="w-8 h-8"
              />
              <span className="text-sm">{item.label}</span>
            </div>

            {/* Visa underkategorier när kategorin är aktiv */}
            {activeIndex === item.id && item.subItems && (
              <div className="flex flex-col mt-4 space-y-2">
                {item.subItems.map((subItem, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-50 hover:bg-blue-100 text-slate-700 rounded-md cursor-pointer transition"
                  >
                    {subItem}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttractionList;