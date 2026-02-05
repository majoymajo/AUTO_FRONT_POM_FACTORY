# SofkianOS

## How to Run

1. **Configure environment**

   Copy the example env file and adjust if needed:

   ```bash
   cp .env.example .env
   ```

   Default credentials in `.env.example` are `guest` / `guest` (suitable for local only).

2. **Start the stack**

   From the project root:

   ```bash
   docker compose up -d
   ```

   This starts RabbitMQ with:
   - **AMQP** on port `5672` (application)
   - **Management UI** on port `15672` (browser: http://localhost:15672)

3. **Stop the stack**

   ```bash
   docker compose down
   ```

   Data is kept in the `rabbitmq_data` volume. To remove it as well:

   ```bash
   docker compose down -v
   ```
