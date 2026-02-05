import "jsr:@supabase/functions-js/edge-runtime.d.ts";

interface SearchParams {
  query?: string;
  species?: string;
  breed?: string;
  ageMin?: number;
  ageMax?: number;
  size?: string;
  location?: string;
  vaccinated?: boolean;
  neutered?: boolean;
  urgent?: boolean;
  sortBy?: 'newest' | 'name' | 'urgent';
  limit?: number;
  offset?: number;
}

console.info('Advanced pet search service started');

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const url = new URL(req.url);
    const params: SearchParams = {
      query: url.searchParams.get('query') || '',
      species: url.searchParams.get('species') || '',
      breed: url.searchParams.get('breed') || '',
      size: url.searchParams.get('size') || '',
      location: url.searchParams.get('location') || '',
      vaccinated: url.searchParams.get('vaccinated') === 'true',
      neutered: url.searchParams.get('neutered') === 'true',
      urgent: url.searchParams.get('urgent') === 'true',
      sortBy: (url.searchParams.get('sortBy') as any) || 'newest',
      limit: parseInt(url.searchParams.get('limit') || '20'),
      offset: parseInt(url.searchParams.get('offset') || '0')
    };

    // Build SQL WHERE clause dynamically
    let whereConditions: string[] = [];

    if (params.query) {
      whereConditions.push(`(
        p.name ILIKE '%${params.query}%' OR
        p.breed ILIKE '%${params.query}%' OR
        p.description ILIKE '%${params.query}%'
      )`);
    }

    if (params.species) {
      whereConditions.push(`p.species = '${params.species}'`);
    }

    if (params.breed) {
      whereConditions.push(`p.breed ILIKE '%${params.breed}%'`);
    }

    if (params.size) {
      whereConditions.push(`p.size = '${params.size}'`);
    }

    if (params.location) {
      whereConditions.push(`p.location ILIKE '%${params.location}%'`);
    }

    if (params.vaccinated) {
      whereConditions.push(`p.vaccinated = true`);
    }

    if (params.neutered) {
      whereConditions.push(`p.neutered = true`);
    }

    // Determine sort order
    let orderBy = 'p.created_at DESC';
    switch (params.sortBy) {
      case 'name':
        orderBy = 'p.name ASC';
        break;
      case 'urgent':
        orderBy = 'p.urgent DESC, p.created_at DESC';
        break;
      default:
        orderBy = 'p.created_at DESC';
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Mock data response (in production, this would query your Supabase database)
    const searchResults = {
      total: 8,
      params: params,
      results: [
        {
          id: '1',
          name: 'Buddy',
          species: 'Dog',
          breed: 'Golden Retriever',
          age: '2 years',
          size: 'Large',
          gender: 'Male',
          location: 'Rajkot Central',
          image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
          vaccinated: true,
          neutered: true,
          urgent: false,
          description: 'Friendly and energetic, loves playing fetch and long walks. Perfect family dog!'
        },
        {
          id: '2',
          name: 'Luna',
          species: 'Cat',
          breed: 'Persian',
          age: '1 year',
          size: 'Small',
          gender: 'Female',
          location: 'University Road',
          image: 'https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg',
          vaccinated: true,
          neutered: true,
          urgent: true,
          description: 'Gentle and affectionate, perfect for quiet homes. Loves cuddling on the couch.'
        }
      ],
      query: {
        where: whereClause,
        orderBy: orderBy,
        limit: params.limit,
        offset: params.offset
      }
    };

    return new Response(
      JSON.stringify(searchResults),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
        },
        status: 200
      }
    );
  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Search failed'
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
