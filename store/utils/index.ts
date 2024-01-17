import { DashboardComponent } from "../preset/dashboardLegis.config";

export const loadDashboardComponentsFromLocalStorage = (dashboardName: string): DashboardComponent[] | undefined => {
    if (typeof window === 'undefined') return undefined;

  try {
    const serializedState = localStorage.getItem(`${dashboardName}-components`);
      if (serializedState === null) return undefined;

      console.log('serializedState', serializedState);

    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage', err);
    return undefined;
  }
};
