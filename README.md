# Planned coding challenge: Memory lane

## High level implementation

I did not change the basic structure of the starter template. I documented any
architecturally significant decision in (very) brief records in the following
section.

For UI, I created something very similar to the provided mockup insofar as it
made sense given the requirements. The main difference is support for multiple
images which required changing the card layout a little.

## Architecture decision records

### ADR 1: Use Zustand for state management

I will be using [Zustand](https://zustand-demo.pmnd.rs/) as a lightweight state
management tool. I don't think a state management solution is strictly necessary
here given the simplicity of the app. However, I've been wanting to try it for
some time and I think this is a good opportunity to do so.

Given the simplicity of the application, I will centralize all use-case-relevant
state into a single store. This will make it easy to cover important logic with
tests. By establishing a boundary between state and UI, the later will be more
flexible making it easier to iterate on the component structure.

### ADR 2: Do optimistic updates

In order to provide the best possible user experience, I will do optimist
updates. This will eliminate perceived latency. For now, if an error occurs, I
will simply refresh the page so the app can recover to its latest valid state.

### ADR 3: Use Zod to define data structures

Zod will allow me to write more descriptive and explicit data structures. It
will also give me strong typing and validation logic out of the box. I will be
able to write more defensive and robust code.

### ADR 4: Store images as BLOBs directly in SQlite

This is definitely the simplest solution to implement. I will have something
fully functional much faster than if I have to figure out and setup cloud
storage. However, this won't necessarily scale well and should be changed before
usage grows too much.

### ADR 5: Segregate data access and controller logic

Currently, the API controllers contains all backend logic. This makes it hard to
reason about and makes maintenance difficult. I will extract all data access
logic as to establish a clear separation of concern. The controllers will only
do data validation and network-related work. Eventually it would also be
responsible for authentication and authorization logic.

## Demo

![Demo](./docs/memory-lane-demo.mp4)

## Possible improvements

### Pagination or virtualized list

If we expect users to have a large number of memories, we should consider
implementing a pagination strategy. We could also consider virtualizing the list
depending on performance requirements or if we wanted infinite scrolling.

### Tune sharing feature

For now, the share button allows users to copy a link or share to facebook. The
UX could be improved by adding share buttons for other platforms our users are
most likely to use.

### User authentication and authorization

The share button generates a link to a page that does not allow the recipient to
edit the memory lane. Ideally we would want to secure memory-lane editing by
implementing proper authentication and authorization strategies.

### Better form validation and UX

Currently, the form is using the default browser validation mechanism. Although
this works, we could provide a better UX by implementing custom validation with
better messages and visual cues on invalid data.

### Images carousel

Allowing users to view a memory's images in a full-screen carousel would make
for a better UX.

### UI transitions

To offer a smoother and more polished experience, UI transition could be
implemented when different elements are mounted, unmounted or changed on the
screen.
