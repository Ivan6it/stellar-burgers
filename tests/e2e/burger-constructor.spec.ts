import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера — интеграционные тесты', () => {
  test.beforeEach(async ({ page }) => {
    // Мокируем сетевые запросы через HAR-файл
    await page.routeFromHAR('tests/hars/api.mock.har', {
      notFound: 'abort'
    });

    // Авторизация
    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'mock-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await page.goto('/');

    // После загрузки прелоадер должен исчезнуть
    await expect(page.getByTestId('preloader')).not.toBeVisible();
  });

  // Очистка состояния между тестами
  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.context().clearCookies();
    await page.close();
  });

  test('добавление ингредиентов в конструктор', async ({ page }) => {
    // Добавляем булку
    const bunCard = page.locator('li', { hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    // Проверяем, что булка появилась в конструкторе
    await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();
    await expect(page.getByText('Краторная булка N-200i (низ)')).toBeVisible();

    // Добавляем начинку
    const fillingCard = page.locator('li', {
      hasText: 'Мясо бессмертных моллюсков'
    });
    await fillingCard.getByRole('button', { name: 'Добавить' }).click();

    // Проверяем, что начинка добавилась в конструктор
    await expect(
      page.locator('.constructor-element__text', {
        hasText: 'Мясо бессмертных моллюсков'
      })
    ).toBeVisible();
  });

  test('работа модального окна ингредиента', async ({ page }) => {
    // Открываем модалку по клику
    await page.getByText('Краторная булка N-200i').click();
    await expect(page.getByTestId('modal-title')).toBeVisible();
    await expect(page.getByTestId('modal-title')).toContainText(
      'Детали ингредиента'
    );

    // Проверка данных булки
    await expect(
      page.getByRole('heading', { name: 'Краторная булка N-200i' })
    ).toBeVisible();
    await expect(page.getByText('Калории, ккал')).toBeVisible();
    await expect(page.getByText('420')).toBeVisible();
    await expect(page.getByText('1255')).toBeVisible();

    // Закрытие по крестику
    await page.getByTestId('close-modal').click();
    await expect(page.getByTestId('modal-title')).not.toBeVisible();

    // Повторное открытие
    await page.getByText('Мясо бессмертных моллюсков').click();
    await expect(page.getByTestId('modal-title')).toBeVisible();

    // Проверка данных начинки
    await expect(
      page.getByRole('heading', { name: 'Мясо бессмертных моллюсков' })
    ).toBeVisible();
    await expect(page.getByText('Белки, г')).toBeVisible();
    await expect(page.getByText('433')).toBeVisible();
    await expect(page.getByText('1337')).toBeVisible();

    // Закрытие по оверлею
    await page
      .getByTestId('modal-overlay')
      .click({ position: { x: 10, y: 10 } });
    await expect(page.getByTestId('modal-title')).not.toBeVisible();
  });

  test('оформление заказа и проверка результата', async ({ page }) => {
    // Собираем бургер
    await page
      .locator('li', { hasText: 'Краторная булка N-200i' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .locator('li', { hasText: 'Мясо бессмертных моллюсков' })
      .getByRole('button', { name: 'Добавить' })
      .click();

    // Проверяем добавление
    await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();
    await expect(page.getByText('Краторная булка N-200i (низ)')).toBeVisible();
    await expect(
      page.locator('.constructor-element__text', {
        hasText: 'Мясо бессмертных моллюсков'
      })
    ).toBeVisible();

    // Оформляем заказ
    await page.getByRole('button', { name: /оформить заказ/i }).click();

    // Ждём номер заказа
    await expect(page.getByText('105835')).toBeVisible();

    // Ждём, что конструктор очистился
    await expect(
      page.getByText('Краторная булка N-200i (верх)')
    ).not.toBeVisible();
    await expect(
      page.getByText('Краторная булка N-200i (низ)')
    ).not.toBeVisible();
    await expect(
      page.locator('.constructor-element__text', {
        hasText: 'Мясо бессмертных моллюсков'
      })
    ).not.toBeVisible();

    // Закрываем модалку
    await page.getByTestId('close-modal').click();
    await expect(page.getByText('105835')).not.toBeVisible();

    // Проверка на появление подсказок
    const bunPlaceholders = page.getByText('Выберите булки', { exact: false });
    const fillingPlaceholder = page.getByText('Выберите начинку', {
      exact: false
    });

    await expect(bunPlaceholders).toHaveCount(2);
    await expect(bunPlaceholders.first()).toBeVisible();
    await expect(fillingPlaceholder).toBeVisible();
  });
});
