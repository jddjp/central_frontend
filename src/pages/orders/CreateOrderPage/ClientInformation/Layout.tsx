import {
  Accordion,
  AccordionProps,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionItemProps
} from "@chakra-ui/react"


export interface InformationAreaProps extends AccordionItemProps {
  title: string,
}

export const InformationArea = (props: InformationAreaProps) => {
  const { title, children, ...rest } = props;

  return (
    <AccordionItem {...rest}>
      <AccordionButton fontWeight="bold" >
        {title}
      </AccordionButton>
      <AccordionPanel>
        {children}
      </AccordionPanel>
    </AccordionItem>
  );
}


export interface InformationAreaGroupProps extends AccordionProps { }

export const InformationAreaGroup = (props: InformationAreaGroupProps) => {
  return (
    <Accordion allowToggle {...props} />
  );
}