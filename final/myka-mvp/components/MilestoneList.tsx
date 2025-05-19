import React from 'react';

// Define the Milestone interface
interface Milestone {
  title: string;
  todos: string[];
}

interface Props {
     milestones: Milestone[];
       loading: boolean;
       error?: string;
       onToggle?: (index: number) => void;
    completed?: boolean[];
     }
    
     export default function MilestoneList({
       milestones,
       loading,
       error,
       onToggle,
       completed = [],
     }: Props) {
       if (loading) return <p>Generating milestones…</p>;
       if (error) return <p className="error">{error}</p>;
    
       return (
         <ul className="milestone-list">
           {milestones.map((m, i) => (
             <li key={i}>
               <h4>{m.title}</h4>
               <ul>
                 {m.todos.map((todo, j) => (
                   <li key={j}>
                     <label>
    -                  <input
     type="checkbox"
     onChange={() => onToggle?.(i)}
     />
    +                  <input
     type="checkbox"
     checked={completed[i] || false}
     onChange={() => onToggle?.(i)}
     />
                       {todo}
                     </label>
                   </li>
                 ))}
               </ul>
             </li>
           ))}
         </ul>
       );
     }
    