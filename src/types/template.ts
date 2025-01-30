export interface TextElement {
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontWeight: 'normal' | 'bold';
  fontFamily: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  backgroundUrl: string;
  width: number;
  height: number;
  textElements: TextElement[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateFormData {
  name: string;
  description: string;
  backgroundUrl: string;
  width: number;
  height: number;
}