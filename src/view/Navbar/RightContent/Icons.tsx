import CreateSubquiverModal from "@/model/Modal/CreateSubquiverModalModel";
import { Flex, Icon, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { GrAdd } from "react-icons/gr";

const Icons: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex>
        <Flex
          display={{ base: "none", md: "flex" }}
          align="center"
          borderRight="1px solid"
          borderColor="brand.200"
        >
          <Flex
            display={{ base: "none", md: "flex" }}
            align="center"
            mr={1.5}
            ml={1.5}
            px={3}
            py={1}
            cursor="pointer"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            onClick={onOpen}
          >
            <Icon color="brand.100" as={GrAdd} fontSize={20} />
            <Text color="brand.100" ml={2} fontSize="15" fontWeight="bold">
              Create
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <CreateSubquiverModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Icons;
