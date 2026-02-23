import { getClients } from '@/lib/clients';

export async function GET() {
  const clients = getClients();
  return Response.json(clients);
}
