import { SearchIcon } from '@chakra-ui/icons';
import { Flex, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import React from 'react';

type SearchInputProps = {
    // user;
};

const SearchInput:React.FC<SearchInputProps> = () => {
    
    return  (
        <Flex flexGrow={1} mr={2} align="center" ml={2} maxWidth="40%">
            <InputGroup>
                <InputLeftElement
                    pointerEvents='none'
                    children={<SearchIcon color='brand.100'/>}
                />
                <Input 
                    placeholder='Search Quiver' 
                    fontSize='13pt' 
                    color="brand.100"
                    _placeholder={{ color: "brand.100" }}
                    _hover={{
                        bg: 'brand.200',
                        border: '1px solid',
                        borderColor: "brand.100",

                    }}
                    _focus={{
                        outline:'none',
                        border: '1px solid',
                        borderColor: 'brand.100',
                    }}
                    height="34px"
                    bg="brand.400"
                 />
            </InputGroup>
        </Flex>
    )
}
export default SearchInput;