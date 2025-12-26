
import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

const floors = ['GL', 'SL', 'ML', 'L1', 'L2'];

test.describe('Visual Regression - 5 Floors', () => {
  test('Capture snapshots for all floors', async ({ page }) => {
    // Navigate with ?test=true to disable animations for stable snapshots
    await page.goto('/?test=true');
    
    // Bypass landing screen
    const landing = page.locator('text=Tap to start navigation');
    if (await landing.isVisible()) {
      await landing.click();
    }

    for (const floor of floors) {
      const selector = `[data-testid="floor-btn-${floor}"]`;
      await page.waitForSelector(selector);
      await page.click(selector);
      
      // Wait for 3D slab to potentially finish rendering logic
      // (Even if CSS animation is off, React state might take a tick)
      await page.waitForTimeout(500); 
      
      await percySnapshot(page, `Mall Map - Floor ${floor}`);
    }
  });
});
