
export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface TourPackage {
  id: string;
  title: string;
  description: string;
  duration: string;
  intensity: 'Low' | 'Medium' | 'High';
  image: string;
}
