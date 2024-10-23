// import React, { createContext, useState, useContext, type ReactNode } from 'react';

// interface VentasContextType {
//   ventasUpdated: boolean;
//   triggerVentasUpdate: () => void;
// }

// const VentasContext = createContext<VentasContextType | undefined>(undefined);

// interface VentasProviderProps {
//   children: ReactNode;
// }

// export function VentasProvider({ children }: VentasProviderProps) {
//   const [ventasUpdated, setVentasUpdated] = useState(false);

//   const triggerVentasUpdate = () => {
//     setVentasUpdated(prev => !prev);
//   };

//   const value = {
//     ventasUpdated,
//     triggerVentasUpdate
//   };

//   return (
//     <VentasContext.Provider value={value}>
//       {children}
//     </VentasContext.Provider>
//   );
// }

// export function useVentas(): VentasContextType {
//   const context = useContext(VentasContext);
//   if (context === undefined) {
//     throw new Error('useVentas must be used within a VentasProvider');
//   }
//   return context;
// }

// // Export the context itself
// export { VentasContext };