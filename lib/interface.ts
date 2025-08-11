export interface DailyMealPlan {
  Breakfast?: string;
  Lunch?: string;
  Dinner?: string;
  Snacks?: string;
}

export type WeeklyMealPlan = {
  [day in DayOfWeek]: DailyMealPlan;
};

export interface MealPlanResponse {
  mealPlan?: WeeklyMealPlan;
  error?: string;
}

export interface MealPlanInput {
  dietType: string;
  calories: number | string;
  allergies: string;
  cuisine: string;
  snacks: boolean;
  days?: number;
}
export type DayOfWeek =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";
