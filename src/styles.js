// @flow
import styled from 'styled-components'

const SC = {
  section: styled.section`
    margin: 3em;
    display: ${({ isHide }) => (isHide ? 'none' : 'block')};
  `,
  list: styled.ul`
    margin: 0;
    padding-left: 0;
  `,
  listItem: styled.li`
    list-style-type: none;
  `,
}

export default SC
