import React from 'react';
import { StringInputProps, useFormValue, useClient } from 'sanity';

export function DynamicSizeInput(props: StringInputProps) {
  // Get the full document value to access sizeGroup
  const document = useFormValue([]) as any;
  // Get Sanity client from context with API version
  const client = useClient({ apiVersion: '2025-01-14' });
  
  // Generate dynamic list based on selected size group
  React.useEffect(() => {
    const generateSizeList = async () => {
      const sizeGroupRef = document?.sizeGroup?._ref;
      
      if (!sizeGroupRef) {
        // No size group selected, provide empty list
        props.schemaType.options = { list: [] };
        return;
      }
      
      try {
        // Fetch the size group document
        const sizeGroup = await client.fetch(
          `*[_type == "size" && _id == $id][0]{sizes}`,
          { id: sizeGroupRef }
        );
        
        if (sizeGroup?.sizes && Array.isArray(sizeGroup.sizes)) {
          // Update the options list dynamically - now sizes are objects with name and code
          props.schemaType.options = {
            list: sizeGroup.sizes.map((sizeItem: any) => ({
              title: sizeItem.name,
              value: sizeItem.name // We store the name as the value, but we'll access code separately
            }))
          };
        } else {
          props.schemaType.options = { list: [] };
        }
      } catch (error) {
        console.error('Error fetching size group:', error);
        props.schemaType.options = { list: [] };
      }
    };
    
    generateSizeList();
  }, [document?.sizeGroup?._ref, props.schemaType, client]);
  
  // Render the default string input with updated options
  return props.renderDefault(props);
}