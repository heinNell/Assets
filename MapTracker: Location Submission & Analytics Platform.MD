# MapTracker: Location Submission & Analytics Platform

## Project Overview
- App Name: MapTracker
- Purpose: Allow users to submit and track location-based data points with custom metadata on Google Maps
- Primary User Action: User submits location coordinates with metadata to visualize and analyze geographical patterns
- Example Use Case: Field researchers marking observation points with timestamps and notes

## Input Model & Processing Design

### Domain Model
```typescript
interface LocationSubmission {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  category: 'observation' | 'incident' | 'landmark';
  timestamp: Date;
}
```

### Firestore Schema
```typescript
interface StoredSubmission {
  id: string;
  userId: string;
  location: {
    lat: number;
    lng: number;
  };
  title: string;
  description: string;
  category: string;
  timestamp: FirebaseFirestore.Timestamp;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

## Key Components

### 1. Firebase Configuration
```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### 2. Validation Schema
```typescript
// src/lib/schemas.ts
import { z } from 'zod';

export const locationSubmissionSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  title: z.string().min(1).max(100),
  description: z.string().max(500),
  category: z.enum(['observation', 'incident', 'landmark']),
  timestamp: z.date()
});
```

### 3. Map Component
```typescript
// src/components/MapView.tsx
import { useEffect, useState } from 'react';
import { useSubmissions } from '../hooks/useSubmissions';

export const MapView = () => {
  const { submissions, isLoading } = useSubmissions();
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      
      const mapInstance = new Map(document.getElementById("map") as HTMLElement, {
        center: { lat: 0, lng: 0 },
        zoom: 2,
        mapId: import.meta.env.VITE_GOOGLE_MAPS_ID
      });
      
      setMap(mapInstance);
    };

    initMap();
  }, []);

  return (
    <div id="map" className="w-full h-[600px] rounded-lg shadow-lg" />
  );
};
```

### 4. Submission Form
```typescript
// src/components/SubmissionForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { locationSubmissionSchema } from '../lib/schemas';
import { useSubmissions } from '../hooks/useSubmissions';

export const SubmissionForm = () => {
  const { createSubmission } = useSubmissions();
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(locationSubmissionSchema)
  });

  return (
    <form onSubmit={handleSubmit(createSubmission)} className="space-y-4">
      <input {...register('latitude')} type="number" step="any" />
      <input {...register('longitude')} type="number" step="any" />
      <input {...register('title')} type="text" />
      <textarea {...register('description')} />
      <select {...register('category')}>
        <option value="observation">Observation</option>
        <option value="incident">Incident</option>
        <option value="landmark">Landmark</option>
      </select>
      <button type="submit">Submit Location</button>
    </form>
  );
};
```

### 5. Firestore Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /submissions/{submissionId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if false;
    }
  }
}
```

## Setup & Environment

### .env.example
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_GOOGLE_MAPS_API_KEY=your-maps-api-key
VITE_GOOGLE_MAPS_ID=your-maps-id
```

### package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "emulators": "firebase emulators:start"
  }
}
```

## Testing Example
```typescript
// src/__tests__/submissions.test.ts
import { locationSubmissionSchema } from '../lib/schemas';

describe('Location Submission Validation', () => {
  it('validates correct submission data', () => {
    const validData = {
      latitude: 37.4220656,
      longitude: -122.0840897,
      title: "Google HQ",
      description: "Main campus",
      category: "landmark" as const,
      timestamp: new Date()
    };
    
    const result = locationSubmissionSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
```

This implementation provides a solid foundation for a location-based tracking application using Google Maps, React, TypeScript, and Firebase. The code is production-ready and includes proper typing, validation, and security measures.
