// Type checking with narrowing and inference. 
// Defining generics for custom inference. 

type EnumShape<T extends readonly string[]> = { enum: T };

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

type TypeFromShapeValue<T> =
  T extends 'string' ? string :
  T extends 'number' ? number :
  T extends EnumShape<infer U> ? U[number] :
  unknown;

export type ShapeToType<S> = Mutable<{
  [K in keyof S]: TypeFromShapeValue<S[K]>;
}>;

export function isShapeMatch<T extends Record<string, any>>(
  obj: unknown,
  shape: T
): obj is ShapeToType<T> {
  if (typeof obj !== 'object' || obj === null) return false;

  return Object.entries(shape).every(([key, type]) => {
    const val = (obj as any)[key];

    if (typeof type === 'string') {
      return typeof val === type;
    }

    if (typeof type === 'object' && 'enum' in type) {
      return (type.enum as readonly unknown[]).includes(val);
    }  
    
    return false;
  });
}