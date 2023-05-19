"use client";
import { create } from "zustand";
import { URLItem } from "../models/Url";
import { persist, createJSONStorage } from "zustand/middleware";

interface AppState {
	links: URLItem[];
	selectedLink: URLItem | null;
	selectLink: (link: URLItem) => void;
	theme: "light" | "dark";
	setTheme: (theme: "light" | "dark") => void;
	toggleTheme: () => void;
}

const getThemeFromLocalStorage = () => {
	if (typeof window !== "undefined") {
		const theme = localStorage.getItem("theme");
		return theme ?? "light";
	}
	return "light" as any;
};

export const useAppStore = create(
	persist<AppState>(
		(set, get) => ({
			links: [],
			selectedLink: null,
			selectLink: (link) => set({ selectedLink: link }),
			theme: getThemeFromLocalStorage(),
			setTheme: (theme) => set({ theme: theme }),
			toggleTheme: () =>
				set((state) => ({
					theme: state.theme === "light" ? "dark" : "light",
				})),
		}),
		{
			name: "shortr-storage",
			skipHydration: true,
			storage: createJSONStorage(() => localStorage),
		}
	)
);
