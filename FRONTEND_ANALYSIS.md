# Help2Others React Frontend Application - Comprehensive Analysis

**Analysis Date**: March 29, 2026  
**Project Location**: `d:\Help2Others\Help2Others\frontend\`  
**Analysis Scope**: Complete React component structure, API integrations, data flows, and form structures

---

## TABLE OF CONTENTS
1. [Components Overview](#components-overview)
2. [Component Details](#component-details)
3. [API Endpoints](#api-endpoints)
4. [Form Structures](#form-structures)
5. [Data Models](#data-models)
6. [Data Flows](#data-flows)
7. [Validation Rules](#validation-rules)
8. [Gaps & Incomplete Features](#gaps--incomplete-features)

---

## COMPONENTS OVERVIEW

### Main Route Components (from App.jsx)

| Component | File Path | Route | Purpose |
|-----------|-----------|-------|---------|
| Home | `src/Component/Land/Home.jsx` | `/` | Landing page with role selection cards |
| DonorDashboard | `src/Component/Donor/DonorDashboard.jsx` | `/dash` | Donor home with impact stats and active donations |
| DonationCreate | `src/Component/Donor/DonationCreate.jsx` | `/create-donation` | Multi-step form to create food donation |
| Notifications | `src/Component/Donor/Notifications.jsx` | `/notifications` | Notification center for donors |
| Profile | `src/Component/Donor/Profile.jsx` | `/profile` | User profile management with statistics |
| BeneficiaryRequestForm | `src/Component/Homes/BeneficiaryRequestForm.jsx` | `/homes` | Multi-step form for beneficiary organizations |
| DeliveryDashboard | `src/Component/Picker/DeliveryDashboard.jsx` | `/picker` | Dashboard for delivery volunteers |
| SocialWorkerDashboard | `src/Component/Socialworker/SocialWorkerDashboard.jsx` | `/social` | Dashboard for social workers (QA/verification) |
| DonorData | `src/Component/Donor/DonorData.jsx` | `/donor-data` | District-wise donor data viewer with verification |

---

## COMPONENT DETAILS

### 1. HOME COMPONENT
**File**: [src/Component/Land/Home.jsx](src/Component/Land/Home.jsx)

**Purpose**: Landing page introducing the platform with role-based navigation

**State**:
- `activeComponent` (string|null) - Currently selected role component
- `filteredResults` (array) - Results from location filter
- `filtersApplied` (boolean) - Whether filters have been applied

**Props**: None (standalone component)

**Render Logic**:
- Lines 1-45: Navigation header with logo and menu
- Lines 46-70: Hero section with background image and CTA button
- Lines 71-100: Impact statistics display
- Lines 101+: Interactive role selection cards:
  - Food Donors (Restaurants/Hotels) → routes to `/dash`
  - Beneficiaries (NGOs/Organizations) → load BeneficiaryRequestForm
  - Delivery Volunteers → load DeliveryDashboard
  - Social Workers → load SocialWorkerDashboard

**Sub-components**:
- LocationFilter (lines 120+)

---

### 2. DONOR DASHBOARD COMPONENT
**File**: [src/Component/Donor/DonorDashboard.jsx](src/Component/Donor/DonorDashboard.jsx)  
**Lines**: 1-150 (partially commented, shown code is mock data structure)

**Purpose**: Main donor dashboard with impact stats and active donations list

**State** (from code structure):
- Mock data for stats object:
  - `totalDonations`: number
  - `mealsDonated`: number
  - `kgSaved`: number
  - `co2Reduced`: number
- `activeDonations`: array of donation objects

**Props**: None

**Features**:
- Impact statistics display (4 stat cards)
- Create New Donation button (navigates to `/create-donation`)
- Active Donations list rendering
- Recent Activity feed
- Navigation to Notifications

**Status**: Component appears to be using mock data; actual API integration status unclear

---

### 3. DONATION CREATE COMPONENT
**File**: [src/Component/Donor/DonationCreate.jsx](src/Component/Donor/DonationCreate.jsx)

**Purpose**: Multi-step form for donors to create food donations

**State**:
```javascript
{
  step: number (1-4),
  formData: {
    // Step 1: Food Details
    foodType: string,
    description: string,
    quantity: string,
    unit: string,
    image: File|null,
    
    // Step 2: Availability
    expiryDate: string,
    expiryTime: string,
    pickupStartDate: string,
    pickupStartTime: string,
    pickupEndDate: string,
    pickupEndTime: string,
    isRecurring: boolean,
    recurringFrequency: 'weekly'|'daily'|'biweekly'|'monthly',
    
    // Step 3: Location
    address: string,
    city: string,
    zipCode: string,
    specialInstructions: string
  },
  errors: object,
  isSubmitting: boolean
}
```

**Props**: None

**Sub-components**:
- [ProgressSteps](src/Component/Donor/Components/ProgressSteps.jsx) - Lines 357
- [FoodDetailsForm](src/Component/Donor/Components/FoodDetailsForm.jsx) - Step 1
- [AvailabilityForm](src/Component/Donor/Components/AvailabilityForm.jsx) - Step 2
- [LocationForm](src/Component/Donor/Components/LocationForm.jsx) - Step 3
- [ReviewForm](src/Component/Donor/Components/ReviewForm.jsx) - Step 4

**Validation** (Lines 98-153):
- **Step 1**:
  - `foodType`: Required, non-empty
  - `quantity`: Required, numeric, > 0
  - `unit`: Required, non-empty
  
- **Step 2**:
  - `expiryDate`: Must be in future
  - `pickupStartDateTime` < `pickupEndDateTime`
  - `pickupEndDateTime` ≤ `expiryDateTime`
  
- **Step 3**:
  - `address`: Required, non-empty
  - `city`: Required, non-empty
  - `zipCode`: Required, non-empty

**API Call** (Lines 263-282):
```javascript
POST http://localhost:8080/api/donations
Content-Type: multipart/form-data
Body: FormData object with all form fields including image file
Response: { success: boolean, message: string }
```

**Features**:
- Food type autocomplete with suggestions (lines 38-46)
- Dynamic unit suggestions based on food type (lines 48-62)
- Geolocation integration using browser geolocation API (lines 183-213)
- Profile address auto-fill (lines 215-242)
- OpenCage geocoding API for reverse address lookup (lines 187-191)
- Multi-step form navigation
- Form validation per step
- Image file upload support

---

### 4. PROFILE COMPONENT
**File**: [src/Component/Donor/Profile.jsx](src/Component/Donor/Profile.jsx)

**Purpose**: Display and edit donor/organization profile

**State**:
```javascript
{
  profile: {
    id: number,
    name: string,
    email: string,
    phone: string,
    address: string,
    organizationType: string,
    bio: string,
    profileImage: string,
    joinDate: string (ISO)
  },
  formData: {
    name: string,
    email: string,
    phone: string,
    address: string,
    organizationType: string,
    bio: string,
    profileImage: string
  },
  stats: {
    totalDonations: number,
    impactScore: number,
    mealsDonated: number,
    rescuedWeight: number (kg)
  },
  isLoading: boolean,
  isEditing: boolean
}
```

**Props**: None

**Features**:
- Profile display with image
- Statistics display (4 stat cards)
- Edit mode toggle
- Form submission (currently using mock data with 1s timeout)

**Data Fetching** (Lines 20-40):
- Lines 36-45: Mock API call with 1s delay (simulated)

---

### 5. NOTIFICATIONS COMPONENT
**File**: [src/Component/Donor/Notifications.jsx](src/Component/Donor/Notifications.jsx)

**Purpose**: Display notifications to donors about their donations

**State**:
```javascript
{
  notifications: [
    {
      id: number,
      type: 'pickup_request'|'status_change'|'reminder'|'thank_you'|'feedback',
      title: string,
      message: string,
      status: 'read'|'unread',
      timestamp: string (ISO),
      actionRequired: boolean,
      donation: {
        id: number,
        title: string
      }
    }
  ],
  isLoading: boolean,
  filter: 'all'|'unread'|'action'
}
```

**Mock Notifications** (Lines 28-73):
- Pickup request notifications
- Status change notifications (donation collected)
- Time-based reminders
- Thank you notes
- Recipient feedback

---

### 6. DONOR DATA COMPONENT
**File**: [src/Component/Donor/DonorData.jsx](src/Component/Donor/DonorData.jsx)

**Purpose**: View district-wise donor data and trigger verification workflow

**State**:
```javascript
{
  district: string,
  donors: [
    {
      donation_id: number,
      food_type: string,
      description: string,
      quantity: number,
      unit: string,
      address: string,
      city: string,
      zip_code: string,
      status: 'pending'|'verified'|'rejected',
      donor: string
    }
  ],
  socialWorker: {
    name: string,
    phone: string,
    email: string,
    district: string
  },
  loading: boolean,
  selectedDonation: number|null,
  verificationStatus: object
}
```

**District Options** (Lines 13-16):
- Chennai
- Coimbatore
- Madurai
- Tiruchirappalli

**API Calls**:

1. **Get Donors by District** (Lines 25-35):
   ```javascript
   GET http://localhost:8080/api/donors?district={district}
   Response: {
     success: boolean,
     donors: array
   }
   ```

2. **Notify Social Worker** (Lines 50-61):
   ```javascript
   POST http://localhost:8080/api/notify-social-worker
   Body: {
     district: string,
     donationId: number
   }
   Response: {
     success: boolean,
     socialWorker: object
   }
   ```

3. **Refetch Donors** (Lines 63-72):
   ```javascript
   GET http://localhost:8080/api/donors?district={district}
   (Called after 2s delay for verification simulation)
   ```

---

### 7. BENEFICIARY REQUEST FORM COMPONENT
**File**: [src/Component/Homes/BeneficiaryRequestForm.jsx](src/Component/Homes/BeneficiaryRequestForm.jsx)

**Purpose**: Multi-step form for beneficiary organizations to register and request food

**State**:
```javascript
{
  formData: {
    // Organization Info
    organizationName: string,
    organizationType: 'ngo'|'oldAgeHome'|'orphanage'|'shelter'|'other',
    registrationNumber: string,
    establishedYear: number,
    
    // Location Info
    state: string,
    district: string,
    address: string,
    pincode: string,
    coordinates: { lat: string, lng: string },
    
    // Contact Info
    contactPerson: string,
    phoneNumber: string,
    email: string,
    
    // Capacity Info
    totalCapacity: number,
    currentOccupancy: number,
    maleCount: number,
    femaleCount: number,
    childrenCount: number,
    elderlyCount: number,
    specialNeedsCount: number,
    
    // Food Needs
    mealTypes: {
      breakfast: boolean,
      lunch: boolean,
      dinner: boolean,
      snacks: boolean
    },
    dietaryRestrictions: {
      vegetarian: boolean,
      vegan: boolean,
      glutenFree: boolean,
      nutFree: boolean,
      diabetic: boolean,
      other: string
    },
    frequencyOfSupply: 'daily'|'weekly'|'monthly'|'oneTime',
    
    // Priority & Additional Info
    priorityLevel: 'low'|'medium'|'high'|'critical',
    additionalNotes: string,
    proofDocuments: File[]
  },
  currentStep: number (1-5),
  totalSteps: number (5)
}
```

**Steps**:
1. Organization Information
2. Location Information
3. Capacity Information
4. Food Needs
5. Priority and Additional Information

**Sub-components**:
- [FormHeader](src/Component/Homes/FormHeader.jsx)
- [FormProgress](src/Component/Homes/FormProgress.jsx)
- [OrganizationInfo](src/Component/Homes/OrganizationInfo.jsx) - Step 1
- [LocationInfo](src/Component/Homes/LocationInfo.jsx) - Step 2
- [CapacityInfo](src/Component/Homes/CapacityInfo.jsx) - Step 3
- [FoodNeeds](src/Component/Homes/FoodNeeds.jsx) - Step 4
- [AdditionalInfo](src/Component/Homes/AdditionalInfo.jsx) - Step 5
- [FormActions](src/Component/Homes/FormActions.jsx)

**Validation** (Implemented in sub-components):
- Organization Type: Required
- State: Required (with cascading to districts)
- District: Required (depends on state selection)
- Total Capacity: Required, min 1
- Current Occupancy: Required, 0-max capacity
- Address: Required
- Pincode: Required, 6 digits pattern `[0-9]{6}`
- At least one meal type: Required
- Priority Level: Optional (defaults to 'medium')
- Supporting Documents: Optional, accepts .pdf, .jpg, .jpeg, .png (max 5MB each)

**Form Uses Utility** (Lines 1):
- Imports `indianStates` and `getDistricts` from `src/utils/locationData.js`

**Status**: Component currently commented out in one version; new version uses modular sub-components (lines 650+)

---

### 8. DELIVERY DASHBOARD COMPONENT
**File**: [src/Component/Picker/DeliveryDashboard.jsx](src/Component/Picker/DeliveryDashboard.jsx)

**Purpose**: Dashboard for delivery volunteers to view and mark deliveries as complete

**State**:
```javascript
{
  district: string,
  deliveries: [
    {
      donation_id: number,
      food_type: string,
      description: string,
      quantity: number,
      unit: string,
      address: string,
      city: string,
      zip_code: string,
      status: 'verified'|'delivered'
    }
  ],
  loading: boolean
}
```

**Features**:
- District selection
- Fetch verified donations ready for delivery
- Mark donation as delivered
- Status verification checks

**API Calls**:

1. **Fetch Deliveries** (Lines 19-31):
   ```javascript
   GET http://localhost:8080/api/donors?district={district}
   Response: { success: boolean, donors: array }
   Filters: Only donations with status === 'verified'
   ```

2. **Mark as Delivered** (Lines 45-60):
   ```javascript
   PATCH http://localhost:8080/api/donations/{donationId}/status
   Body: { status: 'delivered' }
   Response: 200 OK
   ```

---

### 9. SOCIAL WORKER DASHBOARD COMPONENT
**File**: [src/Component/Socialworker/SocialWorkerDashboard.jsx](src/Component/Socialworker/SocialWorkerDashboard.jsx)

**Purpose**: Dashboard for social workers to verify food quality and approve/reject donations

**State**:
```javascript
{
  activeTab: 'donations'|'notifications'|'reports',
  district: string,
  donations: [
    {
      donation_id: number,
      donor: string,
      foodType: string,
      quantity: string,
      pickupLocation: string,
      timeReceived: string,
      priority: 'low'|'medium'|'high'|'critical',
      status: 'pending'|'verified'|'rejected'
    }
  ],
  selectedDonation: object|null,
  verificationChecklist: {
    freshness: boolean,
    packaging: boolean,
    temperature: boolean,
    expiration: boolean,
    quantity: boolean
  },
  verificationNotes: string,
  temperatureReading: string,
  photo: File|null,
  currentView: 'list'|'verification'
}
```

**Features**:
- Tabbed interface (Donations, Notifications, Reports)
- Donations list view with pending items highlighted
- Verification module with checklist
- Photo upload for evidence documentation
- Quality verification checklist:
  - Food appears fresh and edible
  - Packaging is intact and clean
  - Temperature is appropriate (with reading input)
  - Not expired / Within use-by date
  - Quantity matches donation description
- Approve/Reject actions
- Verification notes textarea
- Issue reporting form
- Notification history view

**API Calls**:

1. **Fetch Donations** (Lines 408-425):
   ```javascript
   GET http://localhost:8080/api/donors?district={district}
   Response: { success: boolean, donors: array }
   Maps backend fields to frontend fields
   ```

2. **Approve Donation** (Lines 70-83):
   ```javascript
   PATCH http://localhost:8080/api/donations/{donation_id}/status
   Body: { status: 'verified' }
   Response: 200 OK
   ```

3. **Reject Donation** (Lines 100-113):
   ```javascript
   PATCH http://localhost:8080/api/donations/{donation_id}/status
   Body: { status: 'rejected' }
   Response: 200 OK
   ```

---

## SUB-COMPONENTS DETAIL

### Progress & Form Components

#### ProgressSteps
**File**: [src/Component/Donor/Components/ProgressSteps.jsx](src/Component/Donor/Components/ProgressSteps.jsx)

**Props**:
- `currentStep` (number) - Current active step (1-4)

**Renders**: Visual indicator of progress with step numbers and connecting lines

---

#### FoodDetailsForm
**File**: [src/Component/Donor/Components/FoodDetailsForm.jsx](src/Component/Donor/Components/FoodDetailsForm.jsx)

**Props**:
- `formData` (object)
- `errors` (object)
- `handleInputChange` (function)
- `foodTypes` (array)
- `getUnitSuggestions` (function)
- `handleNextStep` (function)

**Fields**:
- Food Type (text input with datalist autocomplete)
- Description (textarea, optional)
- Quantity (number input)
- Unit (select with datalist)
- Image (file upload, optional)

---

#### AvailabilityForm
**File**: [src/Component/Donor/Components/AvailabilityForm.jsx](src/Component/Donor/Components/AvailabilityForm.jsx)

**Props**:
- `formData` (object)
- `errors` (object)
- `handleInputChange` (function)
- `handleNextStep` (function)
- `handlePrevStep` (function)

**Fields**:
- Expiry Date & Time (date + time inputs)
- Pickup Window Start (date + time inputs)
- Pickup Window End (date + time inputs)
- Is Recurring (checkbox)
- Recurring Frequency (select: daily|weekly|biweekly|monthly) - Conditional on isRecurring

---

#### LocationForm
**File**: [src/Component/Donor/Components/LocationForm.jsx](src/Component/Donor/Components/LocationForm.jsx)

**Props**:
- `formData` (object)
- `errors` (object)
- `handleInputChange` (function)
- `handleGetCurrentLocation` (function)
- `handleUseProfileAddress` (function)
- `handleNextStep` (function)
- `handlePrevStep` (function)

**Fields**:
- Address (text input)
- City (text input)
- ZIP Code (text input)
- Special Instructions (textarea, optional)

**Buttons**:
- Use Current Location (browser geolocation)
- Use Profile Address (API call to user profile)

---

#### ReviewForm
**File**: [src/Component/Donor/Components/ReviewForm.jsx](src/Component/Donor/Components/ReviewForm.jsx)

**Props**:
- `formData` (object)
- `isSubmitting` (boolean)
- `handleSubmit` (function)
- `handlePrevStep` (function)

**Displays**: Summary of all form data organized by section:
- Food Details
- Availability
- Location

---

### Beneficiary Form Sub-components

#### OrganizationInfo
**File**: [src/Component/Homes/OrganizationInfo.jsx](src/Component/Homes/OrganizationInfo.jsx)

**Props**:
- `formData` (object)
- `handleChange` (function)

**Fields**:
- Organization Name (text, required)
- Organization Type (select: ngo|oldAgeHome|orphanage|shelter|other, required)
- Registration Number (text, optional)
- Year Established (number, optional, min: 1900, max: current year)

---

#### LocationInfo
**File**: [src/Component/Homes/LocationInfo.jsx](src/Component/Homes/LocationInfo.jsx)

**Props**:
- `formData` (object)
- `handleChange` (function)

**Imports**: `indianStates`, `getDistricts` from `src/utils/locationData.js`

**Fields**:
- State (select, required, cascading)
- District (select, required, depends on state)
- Full Address (textarea, required)
- PIN Code (text, required, pattern: `[0-9]{6}`)

---

#### CapacityInfo
**File**: [src/Component/Homes/CapacityInfo.jsx](src/Component/Homes/CapacityInfo.jsx)

**Props**:
- `formData` (object)
- `handleChange` (function)

**Fields**:
- Total Capacity (number, required, min: 1)
- Current Occupancy (number, required, 0 - totalCapacity)
- Male Count (number, optional, min: 0)
- Female Count (number, optional, min: 0)
- Children Count (number, optional, min: 0)
- Elderly Count (number, optional, min: 0)
- Special Needs Count (number, optional, min: 0)

---

#### FoodNeeds
**File**: [src/Component/Homes/FoodNeeds.jsx](src/Component/Homes/FoodNeeds.jsx)

**Props**:
- `formData` (object)
- `handleChange` (function)

**Fields**:
- Meal Types Required (checkboxes): breakfast, lunch, dinner, snacks
- Frequency of Supply (select: daily|weekly|monthly|oneTime)
- Dietary Restrictions (checkboxes): vegetarian, vegan, glutenFree, diabetic
- Other Dietary Requirements (textarea, optional)

---

#### AdditionalInfo
**File**: [src/Component/Homes/AdditionalInfo.jsx](src/Component/Homes/AdditionalInfo.jsx)

**Props**:
- `formData` (object)
- `handleChange` (function)
- `handleFileUpload` (function)

**Fields**:
- Priority Level (select: low|medium|high|critical)
- Additional Notes (textarea, optional)
- Proof Documents (file upload, multiple, accepts .pdf/.jpg/.jpeg/.png, max 5MB each)
- Consent Checkbox (required)

---

#### FormHeader, FormProgress, FormActions
**Files**: 
- [FormHeader.jsx](src/Component/Homes/FormHeader.jsx)
- [FormProgress.jsx](src/Component/Homes/FormProgress.jsx)
- [FormActions.jsx](src/Component/Homes/FormActions.jsx)

**Purpose**: Presentational components for form UI organization

---

### LocationFilter Component
**File**: [src/Component/Land/LocationFilter.jsx](src/Component/Land/LocationFilter.jsx)

**Props**:
- `onFilterApply` (function) - Callback when filters are applied

**State**:
```javascript
{
  filters: {
    states: { Maharashtra: boolean, Karnataka: boolean, Gujarat: boolean, Delhi: boolean },
    districts: { Mumbai: boolean, Pune: boolean, Bangalore: boolean, ... },
    cities: { 'Mumbai City': boolean, 'Pune City': boolean, ... }
  }
}
```

**Features**:
- Multi-level filtering (state → district → city)
- Sample data for filtering demonstration
- Supports both donor and beneficiary data filtering

---

## API ENDPOINTS

### Summary Table

| Method | Endpoint | Component | Purpose | Body/Params |
|--------|----------|-----------|---------|-------------|
| POST | `/api/donations` | DonationCreate | Create new food donation | FormData (multipart) |
| GET | `/api/user/profile` | DonationCreate | Fetch user profile for address auto-fill | Authorization header |
| GET | `/api/donors?district={district}` | DonorData, DeliveryDashboard, SocialWorkerDashboard | Get district-wise donor donations | Query param: district |
| POST | `/api/notify-social-worker` | DonorData | Notify social worker for verification | { district, donationId } |
| PATCH | `/api/donations/{donationId}/status` | DeliveryDashboard, SocialWorkerDashboard | Update donation status | { status: string } |

### Detailed Endpoint Documentation

#### 1. Create Donation
```
POST http://localhost:8080/api/donations
Content-Type: multipart/form-data

Request Body (FormData):
{
  foodType: string,
  description: string,
  quantity: string,
  unit: string,
  image: File,
  expiryDate: string (YYYY-MM-DD),
  expiryTime: string (HH:mm),
  pickupStartDate: string (YYYY-MM-DD),
  pickupStartTime: string (HH:mm),
  pickupEndDate: string (YYYY-MM-DD),
  pickupEndTime: string (HH:mm),
  isRecurring: string ('true' or 'false'),
  recurringFrequency: string,
  address: string,
  city: string,
  zipCode: string,
  specialInstructions: string
}

Response:
{
  success: boolean,
  message: string,
  donationId?: number
}

Location**: [DonationCreate.jsx, lines 263-282]
```

#### 2. Get User Profile
```
GET http://localhost:8080/api/user/profile
Headers: {
  Authorization: Bearer {token}
}

Response:
{
  user: {
    id: number,
    address: string,
    city: string,
    zip_code: string,
    ... other profile fields
  }
}

Location**: [DonationCreate.jsx, lines 218-235]
```

#### 3. Get Donors by District
```
GET http://localhost:8080/api/donors?district={encodeURIComponent(district)}

Response:
{
  success: boolean,
  donors: [
    {
      donation_id: number,
      food_type: string,
      description: string,
      quantity: number,
      unit: string,
      address: string,
      city: string,
      zip_code: string,
      status: 'pending' | 'verified' | 'rejected' | 'delivered',
      id?: number, // fallback if donation_id missing
      created_at?: string (ISO timestamp),
      priority?: string,
      donor?: string
    }
  ]
}

Used By**:
- [DonorData.jsx, lines 25-35]
- [DeliveryDashboard.jsx, lines 19-31]
- [SocialWorkerDashboard.jsx, lines 408-425]
```

#### 4. Notify Social Worker
```
POST http://localhost:8080/api/notify-social-worker

Request Body:
{
  district: string,
  donationId: number
}

Response:
{
  success: boolean,
  socialWorker: {
    name: string,
    phone: string,
    email: string,
    district: string
  }
}

Location**: [DonorData.jsx, lines 50-61]
```

#### 5. Update Donation Status
```
PATCH http://localhost:8080/api/donations/{donationId}/status

Request Body:
{
  status: 'verified' | 'rejected' | 'delivered'
}

Response: 200 OK (no body documented)

Used By**:
- [DeliveryDashboard.jsx, lines 45-60] → status: 'delivered'
- [SocialWorkerDashboard.jsx, lines 70-83] → status: 'verified'
- [SocialWorkerDashboard.jsx, lines 100-113] → status: 'rejected'
```

---

## DATA MODELS

### Donation Data Model
```javascript
{
  donation_id: number,
  food_type: string,
  description: string,
  quantity: number,
  unit: string,
  image?: string (URL or file),
  expiryDate: string (YYYY-MM-DD),
  expiryTime: string (HH:mm),
  pickupStartDate: string,
  pickupStartTime: string,
  pickupEndDate: string,
  pickupEndTime: string,
  isRecurring: boolean,
  recurringFrequency?: string,
  address: string,
  city: string,
  zip_code: string,
  specialInstructions?: string,
  status: 'pending' | 'verified' | 'rejected' | 'delivered',
  created_at?: string (ISO),
  donor?: string,
  priority?: string
}
```

### Beneficiary Organization Data Model
```javascript
{
  // Organization Info
  organizationName: string,
  organizationType: 'ngo' | 'oldAgeHome' | 'orphanage' | 'shelter' | 'other',
  registrationNumber?: string,
  establishedYear?: number,
  
  // Location Info
  state: string,
  district: string,
  address: string,
  pincode: string,
  coordinates?: { lat: number, lng: number },
  
  // Contact Info
  contactPerson?: string,
  phoneNumber?: string,
  email?: string,
  
  // Capacity Info
  totalCapacity: number,
  currentOccupancy: number,
  maleCount?: number,
  femaleCount?: number,
  childrenCount?: number,
  elderlyCount?: number,
  specialNeedsCount?: number,
  
  // Food Needs
  mealTypes: {
    breakfast: boolean,
    lunch: boolean,
    dinner: boolean,
    snacks: boolean
  },
  dietaryRestrictions: {
    vegetarian: boolean,
    vegan: boolean,
    glutenFree: boolean,
    nutFree?: boolean,
    diabetic: boolean,
    other?: string
  },
  frequencyOfSupply: 'daily' | 'weekly' | 'monthly' | 'oneTime',
  
  // Priority & Additional
  priorityLevel: 'low' | 'medium' | 'high' | 'critical',
  additionalNotes?: string,
  proofDocuments?: File[]
}
```

### User Profile Data Model
```javascript
{
  id: number,
  name: string,
  email: string,
  phone: string,
  address: string,
  city: string,
  zip_code: string,
  organizationType?: string,
  bio?: string,
  profileImage?: string (URL),
  joinDate: string (ISO),
  totalDonations?: number,
  impactScore?: number,
  mealsDonated?: number,
  rescuedWeight?: number
}
```

### Notification Data Model
```javascript
{
  id: number,
  type: 'pickup_request' | 'status_change' | 'reminder' | 'thank_you' | 'feedback',
  title: string,
  message: string,
  status: 'read' | 'unread',
  timestamp: string (ISO),
  actionRequired: boolean,
  donation: {
    id: number,
    title: string
  }
}
```

---

## DATA FLOWS

### 1. Donation Creation Flow
```
User (Home) 
  ↓
Donor Dashboard (click "Create New Donation")
  ↓
DonationCreate Component
  ├→ Step 1: FoodDetailsForm (food type, quantity, image)
  ├→ Step 2: AvailabilityForm (expiry, pickup window, recurring)
  ├→ Step 3: LocationForm (address, city, zip)
  │   ├→ Option: Use Current Location (browser geolocation → OpenCage API)
  │   └→ Option: Use Profile Address (GET /api/user/profile)
  ├→ Step 4: ReviewForm (summary review)
  │
  └→ Submit
      ↓
      POST /api/donations
      ↓
      Backend validates & stores
      ↓
      Navigate to /dash
      ↓
      Display success message
```

### 2. Donation Verification Flow
```
Social Worker Dashboard
  ├→ GET /api/donors?district=X
  │
  ├→ View pending donations list
  │
  ├→ Select donation to verify
  │   ├→ Complete quality checklist
  │   ├→ Upload photo evidence
  │   ├→ Add verification notes
  │   └→ Either:
  │       ├→ Approve: PATCH /api/donations/{id}/status → {status: 'verified'}
  │       └→ Reject: PATCH /api/donations/{id}/status → {status: 'rejected'}
  │
  └→ Notification sent to picker (if approved)
```

### 3. Delivery Pickup Flow
```
Delivery Volunteer (Picker)
  ├→ GET /api/donors?district=X
  ├→ Filter by status === 'verified'
  ├→ View verified donations ready for pickup
  ├→ Execute pickup
  └→ Mark as delivered: PATCH /api/donations/{id}/status → {status: 'delivered'}
```

### 4. Verification Trigger Flow
```
DonorData Component
  ├→ GET /api/donors?district=X
  ├→ Display pending donations
  ├→ Click "Verify Donation"
  │   ├→ POST /api/notify-social-worker {district, donationId}
  │   ├→ Receive assigned social worker details
  │   ├→ Wait 2s delay (simulation)
  │   └→ Refetch: GET /api/donors?district=X
  │
  └→ Show updated status
```

### 5. Beneficiary Organization Registration Flow
```
User (Home)
  ↓
Select "Beneficiaries" card
  ↓
BeneficiaryRequestForm Component
  ├→ Step 1: OrganizationInfo
  ├→ Step 2: LocationInfo (with cascading state→district)
  ├→ Step 3: CapacityInfo
  ├→ Step 4: FoodNeeds
  ├→ Step 5: AdditionalInfo (file upload + consent)
  │
  └→ Submit
      ↓
      Currently: Local alert (not yet implemented in backend)
      ↓
      Should: POST to backend (endpoint not yet shown)
```

---

## FORM STRUCTURES

### DonationCreate - 4 Steps

#### Step 1: Food Details
| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| foodType | autocomplete | ✓ | Non-empty | '' |
| description | textarea | ✗ | N/A | '' |
| quantity | number | ✓ | > 0, numeric | '' |
| unit | autocomplete | ✓ | Non-empty | '' |
| image | file | ✗ | image/* | null |

**Autocomplete Sources**:
- Food Types: 'Fresh Produce', 'Bakery Items', 'Prepared Meals', 'Canned Goods', 'Dairy Products', 'Meat & Poultry', 'Seafood', 'Grains & Cereals', 'Snacks', 'Beverages'
- Units: Dynamic based on foodType (lines 48-62)

#### Step 2: Availability
| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| expiryDate | date | ✓ | Future date | '' |
| expiryTime | time | ✓ | N/A | '' |
| pickupStartDate | date | ✓ | N/A | '' |
| pickupStartTime | time | ✓ | N/A | '' |
| pickupEndDate | date | ✓ | After start | '' |
| pickupEndTime | time | ✓ | After start time | '' |
| isRecurring | checkbox | ✗ | N/A | false |
| recurringFrequency | select | ✗ | Conditional | 'weekly' |

**Frequency Options** (if isRecurring=true):
- daily
- weekly
- biweekly
- monthly

#### Step 3: Location & Instructions
| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| address | text | ✓ | Non-empty | '' |
| city | text | ✓ | Non-empty | '' |
| zipCode | text | ✓ | Non-empty | '' |
| specialInstructions | textarea | ✗ | N/A | '' |

**Location Helpers**:
- "Use Current Location" button → browser geolocation + OpenCage reverse geocoding
- "Use Profile Address" button → GET /api/user/profile

#### Step 4: Review
Review-only step displaying:
- All food details
- All availability details
- All location details
- Image filename

---

### BeneficiaryRequestForm - 5 Steps

#### Step 1: Organization Information
| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| organizationName | text | ✓ | Non-empty | '' |
| organizationType | select | ✓ | One of enum | '' |
| registrationNumber | text | ✗ | N/A | '' |
| establishedYear | number | ✗ | 1900-current year | '' |

**Organization Types**:
- ngo
- oldAgeHome
- orphanage
- shelter
- other

#### Step 2: Location Information
| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| state | select | ✓ | From indianStates | '' |
| district | select | ✓ | Cascading on state | '' |
| address | textarea | ✓ | Non-empty | '' |
| pincode | text | ✓ | Pattern: [0-9]{6} | '' |

**States Source**: [locationData.js](src/utils/locationData.js) - 28 Indian states
**Districts Source**: Cascading based on selected state

#### Step 3: Capacity Information
| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| totalCapacity | number | ✓ | min: 1 | '' |
| currentOccupancy | number | ✓ | 0 - totalCapacity | '' |
| maleCount | number | ✗ | min: 0 | '' |
| femaleCount | number | ✗ | min: 0 | '' |
| childrenCount | number | ✗ | min: 0 | '' |
| elderlyCount | number | ✗ | min: 0 | '' |
| specialNeedsCount | number | ✗ | min: 0 | '' |

#### Step 4: Food Needs
| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| mealTypes.breakfast | checkbox | ✗ | N/A | false |
| mealTypes.lunch | checkbox | ✗ | N/A | false |
| mealTypes.dinner | checkbox | ✗ | N/A | false |
| mealTypes.snacks | checkbox | ✗ | N/A | false |
| frequencyOfSupply | select | ✗ | One of enum | 'daily' |
| dietaryRestrictions.vegetarian | checkbox | ✗ | N/A | false |
| dietaryRestrictions.vegan | checkbox | ✗ | N/A | false |
| dietaryRestrictions.glutenFree | checkbox | ✗ | N/A | false |
| dietaryRestrictions.diabetic | checkbox | ✗ | N/A | false |
| dietaryRestrictions.other | textarea | ✗ | N/A | '' |

**Frequency Options**:
- daily
- weekly
- monthly
- oneTime

#### Step 5: Priority and Additional Information
| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| priorityLevel | select | ✗ | One of enum | 'medium' |
| additionalNotes | textarea | ✗ | N/A | '' |
| proofDocuments | file | ✗ | .pdf/.jpg/.jpeg/.png, max 5MB | [] |
| consentCheckbox | checkbox | ✓ | Must be checked | false |

**Priority Levels**:
- low
- medium
- high
- critical

**Accepted File Types**:
- .pdf
- .jpg
- .jpeg
- .png
- Max 5MB per file

---

## VALIDATION RULES

### DonationCreate Validation

#### Step 1 Validation (lines 99-114)
```javascript
const validateStep = (1) => {
  if (!formData.foodType.trim()) → Error: 'Food type is required'
  if (!formData.quantity.trim()) → Error: 'Quantity is required'
  if (isNaN(formData.quantity) || Number(formData.quantity) <= 0) 
    → Error: 'Please enter a valid quantity'
  if (!formData.unit.trim()) → Error: 'Unit is required'
}
```

#### Step 2 Validation (lines 116-134)
```javascript
const validateStep = (2) => {
  const now = new Date()
  const expiryDateTime = new Date(`${formData.expiryDate}T${formData.expiryTime}`)
  const pickupStartDateTime = new Date(`${formData.pickupStartDate}T${formData.pickupStartTime}`)
  const pickupEndDateTime = new Date(`${formData.pickupEndDate}T${formData.pickupEndTime}`)
  
  if (expiryDateTime <= now) 
    → Error: 'Expiry time must be in the future'
  if (pickupStartDateTime >= pickupEndDateTime) 
    → Error: 'End time must be after start time'
  if (pickupEndDateTime > expiryDateTime) 
    → Error: 'Pickup window cannot be after expiry time'
}
```

#### Step 3 Validation (lines 136-152)
```javascript
const validateStep = (3) => {
  if (!formData.address.trim()) → Error: 'Address is required'
  if (!formData.city.trim()) → Error: 'City is required'
  if (!formData.zipCode.trim()) → Error: 'ZIP code is required'
}
```

---

## GAPS & INCOMPLETE FEATURES

### Critical Gaps

1. **Missing Backend Integration for BeneficiaryRequestForm**
   - File: [BeneficiaryRequestForm.jsx](src/Component/Homes/BeneficiaryRequestForm.jsx) (lines 740+)
   - Issue: Form submission currently triggers local alert only
   - Action: `handleSubmit()` needs to POST to `POST /api/beneficiary-requests`
   - No endpoint defined in backend communication
   - No error handling or validation feedback

2. **Missing Authentication/Authorization**
   - No auth token storage mechanism beyond localStorage check
   - Token not passed to most API calls (only present in `/api/user/profile`)
   - No login/authentication component or flow
   - No token refresh mechanism
   - No logout functionality visible

3. **Incomplete Notification System**
   - Notifications component [Notifications.jsx](src/Component/Donor/Notifications.jsx) uses mock data (lines 28-73)
   - No API call to fetch real notifications
   - Links to undefined routes: `/donations/{id}/pickup-requests`

4. **Incomplete DonorDashboard Implementation**
   - [DonorDashboard.jsx](src/Component/Donor/DonorDashboard.jsx) is mostly commented out
   - Uses only mock data
   - No actual donations data fetching
   - Missing recent activity feed implementation

5. **Profile Component Not Integrated**
   - [Profile.jsx](src/Component/Donor/Profile.jsx) uses mock API with simulated 1s delay
   - No actual submission to backend on form save
   - No real profile data fetching from authenticated user endpoint

### Medium Priority Issues

6. **Missing Input Sanitization**
   - No HTML escaping on user inputs
   - Potential XSS vulnerability in review/display screens
   - File upload not validated for actual content (only extension)

7. **No Error Boundary Components**
   - No try-catch error handling for component rendering
   - Network errors not gracefully handled in most components
   - No loading skeleton states

8. **Geolocation API Not Fully Implemented**
   - OpenCage API key hardcoded as "YOUR_API_KEY" ([DonationCreate.jsx](src/Component/Donor/DonationCreate.jsx), line 190)
   - Will fail in production without proper key management
   - No fallback if geolocation permission denied

9. **Missing Data Persistence**
   - Form data not saved to localStorage during step progression
   - User loses data if page is refreshed
   - No draft save functionality

10. **Incomplete District Data**
    - [LocationFilter.jsx](src/Component/Land/LocationFilter.jsx) has hardcoded sample data (lines 21-26)
    - Only 5 organizations listed for testing
    - No real dynamic district data source

### Low Priority Items

11. **Missing Image Preview**
    - [FoodDetailsForm.jsx](src/Component/Donor/Components/FoodDetailsForm.jsx) only shows filename, not preview (line 64)
    - Users can't verify they selected correct image before submission

12. **Accessibility Issues**
    - Missing ARIA labels on form inputs
    - No keyboard navigation hints
    - Color-only status indicators (should have text labels too)

13. **Missing Validation Feedback**
    - No real-time validation as user types
    - Validation only triggered on step submission
    - No visual field highlighting for errors beyond error message

14. **Incomplete Recurring Donation Logic**
    - [AvailabilityForm.jsx](src/Component/Donor/Components/AvailabilityForm.jsx) has `isRecurring` checkbox (line 56)
    - UI for selecting frequency exists but backend integration unclear
    - How recurring donations are processed on backend not documented

15. **Missing Location Coordinates**
    - BeneficiaryRequestForm has coordinates field in state (lines 674) but no UI input
    - No map picker component for location selection
    - Pincode not auto-filled from geolocation

---

## SUMMARY STATISTICS

### Components
- **Main Route Components**: 9
- **Sub-components**: 15+
- **Total Components**: 24+

### Forms
- **Multi-step Forms**: 2
  - DonationCreate (4 steps)
  - BeneficiaryRequestForm (5 steps)
- **Single-step Forms**: 3
  - Profile Edit
  - Social Worker Verification
  - Issue Report

### API Endpoints
- **Total Endpoints**: 5
- **GET endpoints**: 2
- **POST endpoints**: 2
- **PATCH endpoints**: 1

### Form Fields
- **DonationCreate**: 13 fields
- **BeneficiaryRequestForm**: 35+ fields
- **Profile**: 6 fields
- **Verification Checklist**: 5 items + notes

### Data Models
- **Donation Model**: ~15 fields
- **Beneficiary Organization Model**: ~30 fields
- **User Profile Model**: ~12 fields
- **Notification Model**: 6 fields

---

## REQUIRED FIELDS SUMMARY

### DonationCreate (Step 1)
- foodType ✓
- quantity ✓
- unit ✓

### DonationCreate (Step 2)
- expiryDate ✓
- expiryTime ✓
- pickupStartDate ✓
- pickupStartTime ✓
- pickupEndDate ✓
- pickupEndTime ✓

### DonationCreate (Step 3)
- address ✓
- city ✓
- zipCode ✓

### BeneficiaryRequestForm (Step 1)
- organizationName ✓
- organizationType ✓

### BeneficiaryRequestForm (Step 2)
- state ✓
- district ✓
- address ✓
- pincode ✓

### BeneficiaryRequestForm (Step 3)
- totalCapacity ✓
- currentOccupancy ✓

### BeneficiaryRequestForm (Step 5)
- consentCheckbox ✓

---

**Analysis Complete** | Total Lines Analyzed: 2,000+ | Components Documented: 24+ | API Endpoints Mapped: 5
