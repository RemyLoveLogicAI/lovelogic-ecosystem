export interface PlanResult {
  action: 'click' | 'type' | 'scroll' | 'wait' | 'finish' | 'fail';
  target?: string;
  value?: string;
  reasoning: string;
}

export interface Planner {
  plan(goal: string, observation: string): Promise<PlanResult>;
}

export class SimplePlanner implements Planner {
  async plan(goal: string, observation: string): Promise<PlanResult> {
    // Very naive implementation: check if goal words exist in observation
    const goalWords = goal.toLowerCase().split(' ');

    // Check for "click [x]"
    if (goal.toLowerCase().startsWith('click')) {
        const target = goal.substring(6).trim();
         // If observation mentions the target, we "found" it
        if (observation.toLowerCase().includes(target.toLowerCase())) {
             return {
                 action: 'click',
                 target: target,
                 reasoning: `Found "${target}" in observation`
             };
        }
    }

    if (observation.includes('Login Button')) {
       return {
           action: 'click',
            target: 'Login Button',
            reasoning: "Detected Login Button, assuming it's useful"
       };
    }

    return {
      action: 'finish',
      reasoning: 'No obvious action found'
    };
  }
}
