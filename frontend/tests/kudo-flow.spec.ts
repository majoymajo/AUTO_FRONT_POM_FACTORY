import { test, expect } from '@playwright/test';

test.describe('Kudo Flow (E2E)', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to local dev server
        await page.goto('http://localhost:5173');
    });

    test('User can successfully send a Kudo', async ({ page }) => {
        // 1. Identify critical elements
        const fromSelect = page.getByLabel('De (Remitente)');
        const toSelect = page.getByLabel('Para (Destino)');
        const categorySelect = page.getByLabel('Categoría');
        const messageInput = page.getByLabel('Mensaje');
        const submitSlider = page.locator('.bg-brand').first(); // The slider thumb

        // 2. Fill Form
        await fromSelect.selectOption({ label: 'Santiago' });
        await toSelect.selectOption({ label: 'Christopher' });
        await categorySelect.selectOption('Innovation');
        await messageInput.fill('Amazing refactoring work on the Adapter pattern!');

        // 3. Interact with Custom Slider (Drag and Drop)
        // Get slider bounds
        const box = await submitSlider.boundingBox();
        if (!box) throw new Error('Slider not found');

        // Perform drag
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(box.x + 500, box.y); // Drag to far right
        await page.mouse.up();

        // 4. Assert Feedback
        const successToast = page.getByText('¡Kudo enviado!');
        await expect(successToast).toBeVisible({ timeout: 5000 });
    });

    test('User cannot send Kudo to themselves (Domain Rule E2E)', async ({ page }) => {
        const fromSelect = page.getByLabel('De (Remitente)');
        const toSelect = page.getByLabel('Para (Destino)');

        // Select same user
        await fromSelect.selectOption({ label: 'Santiago' });
        await toSelect.selectOption({ label: 'Santiago' });

        // Assert Validation Error (Client-side Zod check)
        const errorMsg = page.getByText("You can't send a kudo to yourself!");
        await expect(errorMsg).toBeVisible();

        // Ensure button is disabled or interaction prevented (if implemented)
    });
});
