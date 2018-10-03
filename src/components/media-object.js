import styled from 'react-emotion'

const MediaObject = styled('div')`
  display: flex;
  align-items: flex-start;
`

const MediaObjectSide = styled('div')`
  flex-grow: 0;
  flex-shrink: 0;
`

const MediaObjectContent = styled('div')`
  flex-grow: 1;

  ${MediaObjectSide} + & {
    margin-left: 5px;
  }

  & + ${MediaObjectSide} {
    margin-right: 5px;
  }
`

Object.assign(MediaObject, {
  Side: MediaObjectSide,
  Content: MediaObjectContent
})

export {
  MediaObject,
  MediaObjectSide,
  MediaObjectContent
}
