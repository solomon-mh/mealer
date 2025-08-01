export interface DailyMealPlan {
  Breakfast?: string;
  Lunch?: string;
  Dinner?: string;
  Snacks?: string;
}

export interface WeeklyMealPlan {
  [day: string]: DailyMealPlan;
}

export interface MealPlanResponse {
  mealPlan?: WeeklyMealPlan;
  error?: string;
}

export interface MealPlanInput {
  dietType: string;
  calories: number;
  allergies: string;
  cuisine: string;
  snacks: boolean;
  days?: number;
}
